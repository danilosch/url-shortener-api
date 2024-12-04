import { Request, Response } from "express";
import pool from "../services/db";
import { generateHash } from "../utils/hash";
import logger from "../utils/logger";
import { urlValidator } from "../validators/urlValidator";

export const createUrl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validation = urlValidator.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  const userId = req.user?.userId || null; // Verifica se há usuário autenticado

  const protocol = req.protocol;
  const host = req.headers.host;

  let alias = generateHash(req.body.url);

  try {
    const client = await pool.connect();

    await client.query("BEGIN"); // Inicia a transação

    let retries = 3; // Número de tentativas para gerar novo alias
    while (retries > 0) {
      const result = await client.query("SELECT 1 FROM urls WHERE alias = $1", [
        alias,
      ]);

      if (result.rowCount === 0) {
        break; // Alias está disponível
      }

      alias = generateHash(alias + Math.random()); // Gera novo alias baseado no anterior
      retries -= 1;
    }

    if (retries === 0) {
      client.release();
      return res.status(409).json({ error: "Failed to generate unique alias" });
    }

    const shortURL = `${protocol}://${host}/${alias}`;
    await client.query(
      "INSERT INTO urls (original_url, alias, user_id) VALUES ($1, $2, $3)",
      [req.body.url, alias, userId]
    );

    await client.query("COMMIT"); // Confirma a transação
    client.release();

    return res.status(201).json({ shortURL });
  } catch (err) {
    logger.error(`Error inserting URL: ${(err as Error).message}`);
    try {
      await pool.query("ROLLBACK"); // Reverte a transação em caso de erro
    } catch (rollbackErr) {
      logger.error(
        `Error rolling back transaction: ${(rollbackErr as Error).message}`
      );
    }
    return res.status(500).json({ error: "Failed to store URL" });
  }
};

export const listUrls = async (req: Request, res: Response) => {
  const { userId } = req.user;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT id, original_url, alias, clicks, updated_at FROM urls WHERE user_id = $1 AND deleted_at IS NULL",
      [userId]
    );

    client.release();
    return res.status(200).json(result.rows);
  } catch (err) {
    logger.error("Error listing URLs", err);
    return res.status(500).json({ error: "Failed to list URLs" });
  }
};

export const updateUrl = async (req: Request, res: Response) => {
  const validation = urlValidator.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }
  
  const { userId } = req.user;
  const { id } = req.params;
  const { url } = req.body;

  try {
    const client = await pool.connect();

    const result = await client.query(
      "UPDATE urls SET original_url = $1, updated_at = NOW() WHERE id = $2 AND user_id = $3 AND deleted_at IS NULL",
      [url, id, userId]
    );

    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "URL not found or not accessible" });
    }

    return res.status(200).json({ message: "URL updated successfully" });
  } catch (err) {
    logger.error("Error updating URL", err);
    return res.status(500).json({ error: "Failed to update URL" });
  }
};

export const deleteUrl = async (req: Request, res: Response) => {
  const { userId } = req.user;
  const { id } = req.params;

  try {
    const client = await pool.connect();

    const result = await client.query(
      "UPDATE urls SET deleted_at = NOW() WHERE id = $1 AND user_id = $2 AND deleted_at IS NULL",
      [id, userId]
    );

    client.release();

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "URL not found or not accessible" });
    }

    return res.status(200).json({ message: "URL deleted successfully" });
  } catch (err) {
    logger.error("Error deleting URL", err);
    return res.status(500).json({ error: "Failed to delete URL" });
  }
};

export const getOriginalUrl = async (
  req: Request,
  res: Response
): Promise<void | Response<any, Record<string, any>>> => {
  const { alias } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT original_url FROM urls WHERE alias = $1 AND deleted_at IS NULL",
      [alias]
    );

    if (result.rows.length === 0) {
      client.release();
      return res.status(404).json({ error: "URL not found" });
    }

    // Contabiliza o acesso
    await client.query(
      "UPDATE urls SET clicks = clicks + 1, last_accessed = NOW() WHERE alias = $1",
      [alias]
    );

    client.release();

    return res.redirect(result.rows[0].original_url);
  } catch (err) {
    logger.error("Error retrieving URL", err);
    return res.status(500).json({ error: "Failed to retrieve URL" });
  }
};
