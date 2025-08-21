import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: String,
    ingredients: [String],
    instructions: [String],
    categories: [String],
    photoUrl: String,
    comments: [
      {
        authorName: String,
        text: String,
        createdAt: { type: Date, default: Date.now }
      }
    ],
    ratings: [
      {
        value: { type: Number, min: 1, max: 5 },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  { timestamps: true }
);

const Recipe = mongoose.model("Recipe", recipeSchema);

export default Recipe;
