import { Request, Response } from "express";
import pool from "../services/db";
import { generateHash } from "../utils/hash";
import logger from "../utils/logger";
import { urlValidator } from "../validators/urlValidator";

export const shortenUrl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validation = urlValidator.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

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
      "INSERT INTO urls (original_url, alias) VALUES ($1, $2)",
      [req.body.url, alias]
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

export const getOriginalUrl = async (
  req: Request,
  res: Response
): Promise<void | Response<any, Record<string, any>>> => {
  const { alias } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT original_url FROM urls WHERE alias = $1",
      [alias]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.redirect(result.rows[0].original_url);
  } catch (err) {
    logger.error("Error retrieving URL", err);
    return res.status(500).json({ error: "Failed to retrieve URL" });
  }
};
