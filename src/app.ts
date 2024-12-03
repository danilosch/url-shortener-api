import express, { Application } from "express";
import dotenv from "dotenv";
import urlRouter from "./routes/urlRouter";
import { initDB } from "./services/initDB";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use("/", urlRouter);

(async () => {
  await initDB();
})();

export default app;
