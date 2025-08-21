import { Router } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { ENV } from "../config.js";
import User from "../models/User.js";

const router = Router();

function toPublicUser(user) {
  const obj = user.toObject();
  const { passwordHash, _id, ...rest } = obj;
  return { id: String(_id), ...rest };
}

router.post("/register", async (req, res) => {
  try {
    console.log("📝 Registration attempt:", { name: req.body.name, email: req.body.email });

    const { name, email, password } = req.body || {};
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password are required" });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      console.log("❌ Email already exists:", email);
      return res.status(409).json({ message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email: email.toLowerCase(), passwordHash, favorites: [] });

    console.log("💾 Saving user to MongoDB...");
    await user.save();
    console.log("✅ User saved successfully, ID:", user._id);

    const token = jwt.sign({ sub: user._id, email: user.email }, ENV.JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: toPublicUser(user) });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    console.log("🔐 Login attempt for:", req.body.email);

    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ message: "email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log("❌ User not found:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) {
      console.log("❌ Password mismatch for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    console.log("✅ Login successful for:", email);
    const token = jwt.sign({ sub: user._id, email: user.email }, ENV.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: toPublicUser(user) });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Login failed", error: error.message });
  }
});

export default router;


