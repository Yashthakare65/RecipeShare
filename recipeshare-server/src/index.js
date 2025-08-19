import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config.js";
import { ensureDatabase } from "./utils/db.js";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({ origin: ENV.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRouter);

ensureDatabase().then(() => {
  app.listen(ENV.PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`API listening on port ${ENV.PORT}`);
  });
});


