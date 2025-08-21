import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config.js";
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
  .map((s) => s.replace(/^['"]|['"]$/g, "")) // strip wrapping quotes if any
  .map((s) => s.replace(/\/$/, "")) // strip trailing slash
  .filter(Boolean);

function wildcardToRegExp(pattern) {
  // Support simple wildcard subdomains like https://*.vercel.app
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  const regexSource = "^" + escaped.replace(/\\\*/g, ".*") + "$";
  return new RegExp(regexSource);
}

const allowAllCors = configuredOrigins.includes("*");
// Log normalized CORS config once on boot for debugging
console.log("CORS allowAll:", allowAllCors, "origins:", configuredOrigins);

const originMatchers = allowAllCors
  ? [/.*/]
  : configuredOrigins.map((p) => {
      const normalized = p.toLowerCase();
      if (normalized.includes("*")) return wildcardToRegExp(normalized);
      const escaped = normalized.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
      return new RegExp(`^${escaped}$`);
    });

if (allowAllCors) {
  const corsAll = cors({ origin: true, credentials: true, allowedHeaders: ["Content-Type", "Authorization"] });
  app.use(corsAll);
  app.options("*", corsAll);
} else {
  const corsSelective = cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // non-browser or same-origin
      const o = String(origin).replace(/\/$/, "").toLowerCase();
      const allowed = originMatchers.some((rx) => rx.test(o));
      callback(allowed ? null : new Error("CORS: Origin not allowed"), allowed);
    },
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
  });
  app.use(corsSelective);
  app.options("*", corsSelective);
}

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRouter);

app.listen(ENV.PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`API listening on port ${ENV.PORT}`);
});


