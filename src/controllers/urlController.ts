import { Request, Response } from "express";
import { urlValidator } from "../validators/urlValidator";
import { createHash } from "crypto";
import pool from "../services/db";

export const shortenUrl = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const validation = urlValidator.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  // Geração de uma URL curta usando hash
  const hash = createHash("sha256")
    .update(req.body.url)
    .digest("base64")
    .slice(0, 8); // Pega os primeiros 8 caracteres do hash

  const shortURL = `http://localhost:3000/${hash}`;

  try {
    // Salvando a URL no PostgreSQL
    const client = await pool.connect();
    await client.query(
      "INSERT INTO urls (original_url, short_url) VALUES ($1, $2)",
      [req.body.url, shortURL]
    );
    client.release();

    return res.status(201).json({ shortURL });
  } catch (err) {
    console.error("Error inserting URL", err);
    return res.status(500).json({ error: "Failed to store URL" });
  }
};

export const getOriginalUrl = async (
  req: Request,
  res: Response
): Promise<void | Response<any, Record<string, any>>> => {
  const { shortId } = req.params;

  try {
    const client = await pool.connect();
    const result = await client.query(
      "SELECT original_url FROM urls WHERE short_url = $1",
      [`http://localhost:3000/${shortId}`]
    );
    client.release();

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "URL not found" });
    }

    return res.redirect(result.rows[0].original_url);
  } catch (err) {
    console.error("Error retrieving URL", err);
    return res.status(500).json({ error: "Failed to retrieve URL" });
  }
};
