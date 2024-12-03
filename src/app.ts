import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("URL Shortener APIsss");
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
