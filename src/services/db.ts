import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

// Configuração do banco de dados PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || "admin",
  password: process.env.DB_PASS || "admin",
  database: process.env.DB_DB || "url_shortener",
});

export default pool;
