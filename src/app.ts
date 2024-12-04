import cors from "cors";
import dotenv from "dotenv";
import express, { Application } from "express";
import swaggerUi from "swagger-ui-express";

import authRouter from "./routes/authRouter";
import urlRouter from "./routes/urlRouter";
import { initDB } from "./services/initDB";
import { setupSwagger } from "./docs/swagger";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
setupSwagger(app);
app.use("/auth", authRouter);
app.use("/", urlRouter);

(async () => {
  await initDB();
})();

export default app;
