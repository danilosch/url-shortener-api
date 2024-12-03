import { Request, Response } from "express";
import { urlValidator } from "../validators/urlValidator";

export const shortenUrl = (req: Request, res: Response): Response => {
  const validation = urlValidator.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: validation.error.errors });
  }

  // Simula o encurtamento de URL
  const shortURL = `http://localhost/aZbKq7`; // Este valor será gerado dinamicamente
  
  return res.status(201).json({ shortURL });
};
