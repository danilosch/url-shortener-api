import pool from "./db";

export const initDB = async (): Promise<void> => {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS urls (
      id SERIAL PRIMARY KEY,
      original_url TEXT NOT NULL,
      alias VARCHAR(6) NOT NULL UNIQUE
    );
  `;

  try {
    const client = await pool.connect();
    await client.query(createTableQuery);
    client.release();
    console.log("Database initialized: Table 'urls' ensured.");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1); // Encerra o servidor em caso de falha crítica
  }
};
