import express from "express";
import {
  embed,
  GTE_LARGE_FP16,
  loadModel,
  unloadModel
} from "@qvac/sdk";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"));

const recipes = [
  {
    id: 1,
    name: "Spicy Aloo Masala",
    emoji: "🌶️",
    ingredients: "potato, tomato, onion, green chili, cumin, coriander",
    description: "A spicy Indian potato dish with tomato, onion and aromatic spices."
  },
  {
    id: 2,
    name: "Aloo Tawa Fry",
    emoji: "🥔",
    ingredients: "potato, garlic, chili, turmeric, cumin, lemon",
    description: "Crispy pan-fried potatoes with garlic, chili and a fresh lemon finish."
  },
  {
    id: 3,
    name: "Creamy Mushroom Pasta",
    emoji: "🍝",
    ingredients: "pasta, mushroom, cream, garlic, parmesan, black pepper",
    description: "Creamy garlic mushroom pasta for a comforting dinner."
  },
  {
    id: 4,
    name: "Vegetable Poha",
    emoji: "🥣",
    ingredients: "flattened rice, onion, peas, carrot, peanut, lemon",
    description: "A quick vegetarian Indian breakfast with vegetables and peanuts."
  },
  {
    id: 5,
    name: "Grilled Lemon Chicken",
    emoji: "🍗",
    ingredients: "chicken, lemon, garlic, olive oil, black pepper, herbs",
    description: "Juicy grilled chicken marinated with lemon, garlic and herbs."
  },
  {
    id: 6,
    name: "Mango Yogurt Bowl",
    emoji: "🥭",
    ingredients: "mango, yogurt, honey, oats, berries",
    description: "A cool fruity breakfast bowl with mango, yogurt, oats and berries."
  },
  {
    id: 7,
    name: "Chana Masala",
    emoji: "🍛",
    ingredients: "chickpeas, tomato, onion, ginger, garlic, garam masala",
    description: "A hearty chickpea curry with tomato and Indian spices."
  },
  {
    id: 8,
    name: "Chocolate Banana Oats",
    emoji: "🍫",
    ingredients: "banana, oats, cocoa, milk, honey, cinnamon",
    description: "A sweet and filling breakfast made with banana, oats and cocoa."
  }
];

let modelId = null;
let recipeEmbeddings = null;
let modelLoading = null;

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

function recipeText(recipe) {
  return `${recipe.name}. ${recipe.ingredients}. ${recipe.description}`;
}

async function ensureModel() {
  if (modelId) return modelId;
  if (modelLoading) return modelLoading;

  modelLoading = (async () => {
    console.log("Loading QVAC embedding model...");
    modelId = await loadModel({
      modelSrc: GTE_LARGE_FP16,
      onProgress: (p) => {
        if (Number.isFinite(p.percentage)) {
          process.stdout.write(`\rQVAC model: ${p.percentage.toFixed(0)}%`);
          if (p.percentage >= 100) process.stdout.write("\n");
        }
      }
    });

    console.log("QVAC model ready.");
    return modelId;
  })();

  try {
    return await modelLoading;
  } finally {
    modelLoading = null;
  }
}

async function ensureRecipeEmbeddings() {
  if (recipeEmbeddings) return recipeEmbeddings;

  const id = await ensureModel();
  const texts = recipes.map(recipeText);
  const result = await embed({ modelId: id, text: texts });
  recipeEmbeddings = result.embedding;
  return recipeEmbeddings;
}

app.get("/api/status", (_req, res) => {
  res.json({
    sdk: "@qvac/sdk",
    sdkVersion: "0.20.0",
    modelLoaded: Boolean(modelId),
    indexedRecipes: recipes.length,
    inference: "local"
  });
});

app.post("/api/search", async (req, res) => {
  try {
    const query = String(req.body?.query || "").trim();

    if (!query) {
      return res.status(400).json({ error: "Please enter a recipe search." });
    }

    const id = await ensureModel();
    const embeddings = await ensureRecipeEmbeddings();
    const queryResult = await embed({ modelId: id, text: query });
    const queryEmbedding = queryResult.embedding;

    const results = recipes
      .map((recipe, index) => ({
        ...recipe,
        similarity: cosineSimilarity(queryEmbedding, embeddings[index])
      }))
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5)
      .map((recipe) => ({
        ...recipe,
        match: Math.max(0, Math.min(100, Math.round(recipe.similarity * 100)))
      }));

    res.json({ query, results });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: error?.message || "Local QVAC search failed."
    });
  }
});

const server = app.listen(PORT, () => {
  console.log(`RecipeVault AI running at http://localhost:${PORT}`);
  console.log("AI inference: QVAC local embeddings");
});

async function shutdown(signal) {
  console.log(`\n${signal}: shutting down...`);
  try {
    if (modelId) {
      await unloadModel({ modelId, clearStorage: false });
    }
  } catch (error) {
    console.error("QVAC unload error:", error);
  }
  server.close(() => process.exit(0));
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
