import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config.js";
import { ensureDatabase } from "./utils/db.js";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js";
import mongoose from "mongoose";

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/recipeshare";

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Build a flexible CORS origin checker from ENV.CORS_ORIGIN
const configuredOrigins = String(ENV.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function wildcardToRegExp(pattern) {
  // Support simple wildcard subdomains like https://*.vercel.app
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  const regexSource = "^" + escaped.replace(/\\\*/g, ".*") + "$";
  return new RegExp(regexSource);
}

const originMatchers = configuredOrigins.includes("*")
  ? [/.*/]
  : configuredOrigins.map((p) => (p.includes("*") ? wildcardToRegExp(p) : new RegExp(`^${p.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&")}$`)));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      const allowed = originMatchers.some((rx) => rx.test(origin));
      callback(allowed ? null : new Error("CORS: Origin not allowed"), allowed);
    },
    credentials: true
  })
);
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


