import pool from "./db";

export const initDB = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      original_url TEXT NOT NULL,
      alias VARCHAR(6) NOT NULL UNIQUE,
      user_id INT REFERENCES users(id),
      clicks INT DEFAULT 0,
      last_accessed TIMESTAMP,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW(),
      deleted_at TIMESTAMP
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log("Database initialized: Tables ensured.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1); // Encerra o servidor em caso de falha crítica
  }
};
