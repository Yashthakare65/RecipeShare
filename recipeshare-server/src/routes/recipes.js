import { Router } from "express";
import multer from "multer";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { ENV } from "../config.js";
import Recipe from "../models/Recipe.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

// Cloudinary setup (if configured)
let cloudinary = null;
if (ENV.USE_CLOUDINARY) {
  try {
    const { v2: cloudinaryV2 } = await import('cloudinary');
    cloudinaryV2.config({
      cloud_name: ENV.CLOUDINARY_CLOUD_NAME,
      api_key: ENV.CLOUDINARY_API_KEY,
      api_secret: ENV.CLOUDINARY_API_SECRET
    });
    cloudinary = cloudinaryV2;
    console.log("✅ Cloudinary configured for image uploads");
  } catch (error) {
    console.error("❌ Cloudinary setup failed:", error);
  }
}

// Local storage setup (fallback)
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
  const doc = recipe.toObject();
  const { comments, ratings, _id, authorId, ...rest } = doc;
  const averageRating = ratings && ratings.length
    ? Number((ratings.reduce((a, r) => a + r.value, 0) / ratings.length).toFixed(2))
    : 0;

  // Handle photo URL based on storage type
  let photoUrl = rest.photoUrl;
  if (photoUrl && !photoUrl.startsWith('http')) {
    // Local storage - build absolute URL
    photoUrl = `${ENV.PUBLIC_URL}${photoUrl}`;
  }

  return {
    id: String(_id),
    authorId: authorId ? String(authorId._id || authorId) : undefined,
    ...rest,
    photoUrl,
    averageRating,
    commentsCount: (comments || []).length
  };
}

// Create Recipe
router.post("/", requireAuth, upload.single("photo"), async (req, res) => {
  try {
    const { title, description, ingredients, instructions, categories } = req.body || {};
    if (!title || !description || !ingredients || !instructions) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let photoUrl = null;

    if (req.file) {
      if (cloudinary && ENV.USE_CLOUDINARY) {
        // Upload to Cloudinary
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'recipeshare',
            public_id: `recipe_${uuidv4()}`
          });
          photoUrl = result.secure_url;
          console.log("✅ Image uploaded to Cloudinary:", photoUrl);
        } catch (cloudinaryError) {
          console.error("❌ Cloudinary upload failed:", cloudinaryError);
          // Fallback to local storage
          photoUrl = `/uploads/${req.file.filename}`;
        }
      } else {
        // Local storage
        photoUrl = `/uploads/${req.file.filename}`;
      }
    }

    if (!photoUrl) {
      return res.status(400).json({ message: "Photo is required" });
    }

    const recipe = new Recipe({
      authorId: req.user.id,
      title,
      description,
      ingredients: Array.isArray(ingredients) ? ingredients : String(ingredients).split("\n").map(s => s.trim()).filter(Boolean),
      instructions: Array.isArray(instructions) ? instructions : String(instructions).split("\n").map(s => s.trim()).filter(Boolean),
      categories: categories ? String(categories).split(",").map(c => c.trim()).filter(Boolean) : [],
      photoUrl,
      comments: [],
      ratings: []
    });

    await recipe.save();
    res.status(201).json(toPublicRecipe(recipe));
  } catch (error) {
    console.error("Create recipe error:", error);
    res.status(500).json({ message: "Failed to create recipe" });
  }
});

// Get All Recipes
router.get("/", async (req, res) => {
  try {
    const { category } = req.query || {};
    let query = {};

    if (category) {
      query.categories = { $regex: category, $options: 'i' };
    }

    const recipes = await Recipe.find(query).populate('authorId', 'name');
    res.json(recipes.map(toPublicRecipe));
  } catch (error) {
    console.error("Get recipes error:", error);
    res.status(500).json({ message: "Failed to fetch recipes" });
  }
});

// Get Single Recipe (detailed)
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('authorId', 'name');
    if (!recipe) return res.status(404).json({ message: "Not found" });

    const pub = toPublicRecipe(recipe);
    const comments = (recipe.comments || []).map((c) => ({ id: String(c._id || ''), authorName: c.authorName, text: c.text, createdAt: c.createdAt }));
    const ratings = (recipe.ratings || []).map((r) => ({ id: String(r._id || ''), value: r.value, createdAt: r.createdAt }));
    res.json({ ...pub, comments, ratings });
  } catch (error) {
    console.error("Get recipe error:", error);
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
});

// Update Recipe
router.put("/:id", requireAuth, upload.single("photo"), async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });
    if (recipe.authorId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    const { title, description, ingredients, instructions, categories } = req.body || {};
    if (title) recipe.title = title;
    if (description) recipe.description = description;
    if (ingredients) recipe.ingredients = Array.isArray(ingredients) ? ingredients : String(ingredients).split("\n").map(s => s.trim()).filter(Boolean);
    if (instructions) recipe.instructions = Array.isArray(instructions) ? instructions : String(instructions).split("\n").map(s => s.trim()).filter(Boolean);
    if (typeof categories !== "undefined") recipe.categories = categories ? String(categories).split(",").map(c => c.trim()).filter(Boolean) : [];

    if (req.file) {
      if (cloudinary && ENV.USE_CLOUDINARY) {
        // Upload new image to Cloudinary
        try {
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'recipeshare',
            public_id: `recipe_${uuidv4()}`
          });
          recipe.photoUrl = result.secure_url;
          console.log("✅ Updated image uploaded to Cloudinary:", recipe.photoUrl);
        } catch (cloudinaryError) {
          console.error("❌ Cloudinary upload failed:", cloudinaryError);
          // Fallback to local storage
          recipe.photoUrl = `/uploads/${req.file.filename}`;
        }
      } else {
        // Local storage
        recipe.photoUrl = `/uploads/${req.file.filename}`;
      }
    }

    await recipe.save();
    res.json(toPublicRecipe(recipe));
  } catch (error) {
    console.error("Update recipe error:", error);
    res.status(500).json({ message: "Failed to update recipe" });
  }
});

// Delete Recipe
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });
    if (recipe.authorId.toString() !== req.user.id) return res.status(403).json({ message: "Forbidden" });

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    console.error("Delete recipe error:", error);
    res.status(500).json({ message: "Failed to delete recipe" });
  }
});

// Post a Comment
router.post("/:id/comments", async (req, res) => {
  try {
    const { authorName, text } = req.body || {};
    if (!authorName || !text) return res.status(400).json({ message: "authorName and text required" });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });

    const comment = { authorName, text, createdAt: new Date() };
    recipe.comments.push(comment);
    await recipe.save();

    res.status(201).json(comment);
  } catch (error) {
    console.error("Post comment error:", error);
    res.status(500).json({ message: "Failed to post comment" });
  }
});

// Rate a recipe (1-5)
router.post("/:id/ratings", async (req, res) => {
  try {
    const { value } = req.body || {};
    const num = Number(value);
    if (!Number.isFinite(num) || num < 1 || num > 5) return res.status(400).json({ message: "value 1-5 required" });

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });

    recipe.ratings.push({ value: num, createdAt: new Date() });
    await recipe.save();

    res.status(201).json({ averageRating: toPublicRecipe(recipe).averageRating });
  } catch (error) {
    console.error("Post rating error:", error);
    res.status(500).json({ message: "Failed to post rating" });
  }
});

// Favorites
router.post("/:id/favorite", requireAuth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Not found" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    if (!user.favorites.includes(recipe._id)) {
      user.favorites.push(recipe._id);
      await user.save();
    }

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Add favorite error:", error);
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

router.delete("/:id/favorite", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
    await user.save();

    res.json({ favorites: user.favorites });
  } catch (error) {
    console.error("Remove favorite error:", error);
    res.status(500).json({ message: "Failed to remove favorite" });
  }
});

router.get("/me/favorites", requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const list = user.favorites.map(toPublicRecipe);
    res.json(list);
  } catch (error) {
    console.error("Get favorites error:", error);
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

export default router;


