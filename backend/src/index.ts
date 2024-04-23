// import express from "express";
// import cors from "cors";
//
// const app = express();
//
// app.use(express.json());
// app.use(cors());
//
// app.get("/api/recipe/search", async (req, res) => {
//     res.json({ message: "success!" });
// });
//
// app.listen(5000, () => {
//     console.log("Server running on localhost:5000");
// });

import express from "express";
import cors from "cors";
import { RecipeController } from "./controllers/RecipeController";

const app = express();
const recipeController = new RecipeController();

app.use(express.json());
app.use(cors());

app.get("/api/recipe/search", async (req, res) => {
    await recipeController.search(req, res);
});

app.listen(5000, () => {
    console.log("Server running on localhost:5000");
});
