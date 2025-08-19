import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ENV = {
  PORT: process.env.PORT || 5000,
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret_change_me",
  DATA_FILE: process.env.DATA_FILE || path.join(__dirname, "../data/db.json"),
  UPLOAD_DIR: process.env.UPLOAD_DIR || path.join(__dirname, "../uploads"),
  CORS_ORIGIN: process.env.CORS_ORIGIN || "*",
  PUBLIC_URL: process.env.PUBLIC_URL || `http://127.0.0.1:${process.env.PORT || 5000}`
};


