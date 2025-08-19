import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config.js";
import { readDb, writeDb } from "../utils/db.js";
import { requireAuth } from "../middleware/auth.js";

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, ENV.UPLOAD_DIR),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  }
});

const upload = multer({ storage });

const router = Router();

function toPublicRecipe(recipe) {
  const { comments, ratings, ...rest } = recipe;
  const averageRating = ratings && ratings.length
    ? Number((ratings.reduce((a, r) => a + r.value, 0) / ratings.length).toFixed(2))
    : 0;
  return { ...rest, averageRating, commentsCount: (comments || []).length };
}

// Create Recipe
router.post("/", requireAuth, upload.single("photo"), async (req, res) => {
  const { title, description, ingredients, instructions, categories } = req.body || {};
  if (!title || !description || !ingredients || !instructions) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const photoUrl = req.file ? `/uploads/${req.file.filename}` : null;
  if (!photoUrl) {
    return res.status(400).json({ message: "Photo is required" });
  }
  const db = await readDb();
  const now = new Date().toISOString();
  const recipe = {
    id: uuidv4(),
    authorId: req.user.id,
    title,
    description,
    ingredients: Array.isArray(ingredients) ? ingredients : String(ingredients).split("\n").map(s=>s.trim()).filter(Boolean),
    instructions: Array.isArray(instructions) ? instructions : String(instructions).split("\n").map(s=>s.trim()).filter(Boolean),
    categories: categories ? String(categories).split(",").map(c=>c.trim()).filter(Boolean) : [],
    photoUrl,
    comments: [],
    ratings: [],
    createdAt: now,
    updatedAt: now
  };
  db.recipes.push(recipe);
  await writeDb(db);
  res.status(201).json(toPublicRecipe(recipe));
});

// Get All Recipes
router.get("/", async (req, res) => {
  const { category } = req.query || {};
  const db = await readDb();
  let list = db.recipes;
  if (category) {
    list = list.filter((r) => (r.categories || []).some((c) => c.toLowerCase() === String(category).toLowerCase()));
  }
  res.json(list.map(toPublicRecipe));
});

// Get Single Recipe (detailed)
router.get("/:id", async (req, res) => {
  const db = await readDb();
  const recipe = db.recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Not found" });
  const pub = toPublicRecipe(recipe);
  res.json({ ...pub, comments: recipe.comments, ratings: recipe.ratings });
});

// Update Recipe
router.put("/:id", requireAuth, upload.single("photo"), async (req, res) => {
  const db = await readDb();
  const idx = db.recipes.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  const recipe = db.recipes[idx];
  if (recipe.authorId !== req.user.id) return res.status(403).json({ message: "Forbidden" });

  const { title, description, ingredients, instructions, categories } = req.body || {};
  if (title) recipe.title = title;
  if (description) recipe.description = description;
  if (ingredients) recipe.ingredients = Array.isArray(ingredients) ? ingredients : String(ingredients).split("\n").map(s=>s.trim()).filter(Boolean);
  if (instructions) recipe.instructions = Array.isArray(instructions) ? instructions : String(instructions).split("\n").map(s=>s.trim()).filter(Boolean);
  if (typeof categories !== "undefined") recipe.categories = categories ? String(categories).split(",").map(c=>c.trim()).filter(Boolean) : [];
  if (req.file) recipe.photoUrl = `/uploads/${req.file.filename}`;
  recipe.updatedAt = new Date().toISOString();
  db.recipes[idx] = recipe;
  await writeDb(db);
  res.json(toPublicRecipe(recipe));
});

// Delete Recipe
router.delete("/:id", requireAuth, async (req, res) => {
  const db = await readDb();
  const idx = db.recipes.findIndex((r) => r.id === req.params.id);
  if (idx === -1) return res.status(404).json({ message: "Not found" });
  const recipe = db.recipes[idx];
  if (recipe.authorId !== req.user.id) return res.status(403).json({ message: "Forbidden" });
  db.recipes.splice(idx, 1);
  await writeDb(db);
  res.status(204).end();
});

// Post a Comment
router.post("/:id/comments", async (req, res) => {
  const { authorName, text } = req.body || {};
  if (!authorName || !text) return res.status(400).json({ message: "authorName and text required" });
  const db = await readDb();
  const recipe = db.recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Not found" });
  const comment = { id: uuidv4(), authorName, text, createdAt: new Date().toISOString() };
  recipe.comments.push(comment);
  recipe.updatedAt = new Date().toISOString();
  await writeDb(db);
  res.status(201).json(comment);
});

// Rate a recipe (1-5)
router.post("/:id/ratings", async (req, res) => {
  const { value } = req.body || {};
  const num = Number(value);
  if (!Number.isFinite(num) || num < 1 || num > 5) return res.status(400).json({ message: "value 1-5 required" });
  const db = await readDb();
  const recipe = db.recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Not found" });
  recipe.ratings.push({ id: uuidv4(), value: num, createdAt: new Date().toISOString() });
  recipe.updatedAt = new Date().toISOString();
  await writeDb(db);
  res.status(201).json({ averageRating: toPublicRecipe(recipe).averageRating });
});

// Favorites
router.post("/:id/favorite", requireAuth, async (req, res) => {
  const db = await readDb();
  const recipe = db.recipes.find((r) => r.id === req.params.id);
  if (!recipe) return res.status(404).json({ message: "Not found" });
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  user.favorites = Array.from(new Set([...(user.favorites || []), recipe.id]));
  await writeDb(db);
  res.json({ favorites: user.favorites });
});

router.delete("/:id/favorite", requireAuth, async (req, res) => {
  const db = await readDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  user.favorites = (user.favorites || []).filter((rid) => rid !== req.params.id);
  await writeDb(db);
  res.json({ favorites: user.favorites });
});

router.get("/me/favorites", requireAuth, async (req, res) => {
  const db = await readDb();
  const user = db.users.find((u) => u.id === req.user.id);
  if (!user) return res.status(401).json({ message: "Unauthorized" });
  const list = db.recipes.filter((r) => (user.favorites || []).includes(r.id)).map(toPublicRecipe);
  res.json(list);
});

export default router;


