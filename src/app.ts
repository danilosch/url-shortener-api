import express, { Application } from "express";
import dotenv from "dotenv";
import urlRouter from "./routes/urlRouter";

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use("/api", urlRouter);

export default app;
