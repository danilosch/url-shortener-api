import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import urlRouter from "./routes/urlRouter";
import { initDB } from "./services/initDB";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use("/", urlRouter);

(async () => {
  await initDB();
})();

export default app;
