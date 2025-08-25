import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { ENV } from "./config.js";
import authRouter from "./routes/auth.js";
import recipesRouter from "./routes/recipes.js";
import mongoose from "mongoose";

// ✅ Initialize Express first
const app = express();

const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/recipeshare";

mongoose.connect(mongoURI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
    console.log("📊 Database:", mongoose.connection.db.databaseName);
    console.log("🔗 Connection URL:", mongoURI.replace(/\/\/[^:]+:[^@]+@/, "//***:***@"));
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CORS setup
const configuredOrigins = String(ENV.CORS_ORIGIN || "*")
  .split(",")
  .map((s) => s.trim())
  .map((s) => s.replace(/^['"]|['"]$/g, ""))
  .map((s) => s.replace(/\/$/, ""))
  .filter(Boolean);

function wildcardToRegExp(pattern) {
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  return new RegExp("^" + escaped.replace(/\\\*/g, ".*") + "$", "i");
}

const allowAllCors = configuredOrigins.includes("*");
console.log("CORS allowAll:", allowAllCors, "origins:", configuredOrigins);

const originMatchers = allowAllCors
  ? [/.*/]
  : configuredOrigins.map((p) => {
      if (p.includes("*")) return wildcardToRegExp(p);
      const escaped = p.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");
      return new RegExp(`^${escaped}$`, "i");
    });

if (allowAllCors) {
  const corsAll = cors({ origin: true, credentials: true });
  app.use(corsAll);
  app.options("*", corsAll);
} else {
  const corsSelective = cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const o = String(origin).replace(/\/$/, "");
      const allowed = originMatchers.some((rx) => rx.test(o));
      if (allowed) callback(null, true);
      else callback(new Error("CORS: Origin not allowed"), false);
    },
    credentials: true
  });
  app.use(corsSelective);
  app.options("*", corsSelective);
}

app.use(express.json({ limit: "10mb" }));
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ✅ Root route (for Cron-job.org)
app.get("/", (req, res) => {
  res.send("Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mongodb: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    database: mongoose.connection.db?.databaseName || "unknown"
  });
});

app.get("/api/test", async (req, res) => {
  try {
    const User = (await import("./models/User.js")).default;
    const Recipe = (await import("./models/Recipe.js")).default;

    const userCount = await User.countDocuments();
    const recipeCount = await Recipe.countDocuments();

    res.json({
      users: userCount,
      recipes: recipeCount,
      mongodb: "working"
    });
  } catch (error) {
    console.error("Test endpoint error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/recipes", recipesRouter);

app.listen(ENV.PORT, () => {
  console.log(`API listening on port ${ENV.PORT}`);
});
