import bcrypt from "bcrypt";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../services/db";
import logger from "../utils/logger";
import { loginSchema } from "../validators/loginValidator";
import { registerSchema } from "../validators/userValidator";

export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Valida os dados de entrada
    const validation = registerSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { email, password } = req.body;

    // Verifica se o e-mail já existe
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length > 0) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o usuário no banco
    await pool.query("INSERT INTO users (email, password_hash) VALUES ($1, $2)", [
      email,
      hashedPassword,
    ]);

    return res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    logger.error(`Error creating user: ${(err as Error).message}`);
    return res.status(500).json({ error: "Failed to register user" });
  }
};

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    // Valida os dados de entrada
    const validation = loginSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({ error: validation.error.errors });
    }

    const { email, password } = req.body;

    // Verifica se o usuário existe
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Compara a senha fornecida com a armazenada no banco
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    // Cria o token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (err) {
    logger.error(`Error logging in: ${(err as Error).message}`);
    return res.status(500).json({ error: "Failed to authenticate user" });
  }
};
