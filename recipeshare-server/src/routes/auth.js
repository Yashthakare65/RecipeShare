import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config.js";
import { readDb, writeDb } from "../utils/db.js";

const router = Router();

function toPublicUser(user) {
  const { passwordHash, ...rest } = user;
  return rest;
}

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ message: "name, email, password are required" });
  }
  const db = await readDb();
  const existing = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (existing) {
    return res.status(409).json({ message: "Email already registered" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const user = { id: uuidv4(), name, email, passwordHash, favorites: [] };
  db.users.push(user);
  await writeDb(db);
  const token = jwt.sign({ sub: user.id, email: user.email }, ENV.JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: toPublicUser(user) });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ message: "email and password are required" });
  }
  const db = await readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase());
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const match = await bcrypt.compare(password, user.passwordHash);
  if (!match) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ sub: user.id, email: user.email }, ENV.JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: toPublicUser(user) });
});

export default router;


