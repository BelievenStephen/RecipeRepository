import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import cors from "cors";
import * as RecipeAPI from "./recipe-api";
import { PrismaClient } from "@prisma/client";
import { generateFavoritesReport } from './report-generator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

const app = express();
const prismaClient = new PrismaClient();
// Initialize JWT_SECRET from environment variables for secure token generation
const JWT_SECRET = process.env.JWT_SECRET;
const port = process.env.PORT || 5000;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined. Set it in your .env file.");
}

app.use(express.json());
// Security Feature: CORS middleware to control cross-origin requests
app.use(cors());

// Security Feature: Input validation and sanitization to prevent injection attacks
app.get("/api/recipe/search", async (req: Request, res: Response) => {
    // Validate input: Ensure a search term is provided
    let searchTerm = req.query.searchTerm as string;

    // Check if the search term is empty
    if (!searchTerm) {
        return res.status(400).json({ message: "Search term cannot be empty" });
    }

    // Sanitize input: Allow only alphanumeric characters and spaces
    searchTerm = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "");

    const page = parseInt(req.query.page as string) || 1;

    try {
        const results = await RecipeAPI.searchRecipes(searchTerm, page);
        return res.json(results);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "An error occurred while searching for recipes." });
    }
});



app.get("/api/recipes/:recipeId/summary", async (req: Request, res: Response) => {
    const recipeId = req.params.recipeId;
    const results = await RecipeAPI.getRecipeSummary(recipeId);
    return res.json(results);
});

app.post("/api/recipes/favorite", async (req: Request, res: Response) => {
    const recipeId = req.body.recipeId;

    try {
        const favoriteRecipe = await prismaClient.favoriteRecipes.create({
            data: {
                recipeId: recipeId,
            },
        });
        return res.status(201).json(favoriteRecipe);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/api/recipes/favorite", async (req: Request, res: Response) => {
    try {
        const recipes = await prismaClient.favoriteRecipes.findMany();
        const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());

        const favorites = await RecipeAPI.getFavoriteRecipesByIDs(recipeIds);

        return res.json(favorites);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

app.delete("/api/recipes/favorite", async (req: Request, res: Response) => {
    const recipeId = req.body.recipeId;

    try {
        await prismaClient.favoriteRecipes.delete({
            where: {
                recipeId: recipeId,
            },
        });
        return res.status(204).send();
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Something went wrong" });
    }
});

app.get("/api/report/favorites", async (req: Request, res: Response) => {
    try {
        // Call the generateFavoritesReport function to create the report
        const report = await generateFavoritesReport(prismaClient);
        // Send the report as a JSON response
        res.json(report);
    } catch (error) {
        // Log any errors that occur during report generation
        console.log(error);
        res.status(500).json({ error: "Failed to generate report" });
    }
});


// login page code

// Security Feature: Hash passwords with bcrypt before storing them
// This ensures passwords are not stored in plain text in the database
app.post('/api/auth/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        const existingUser = await prismaClient.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate a salt and hash the password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        // Create user
        const user = await prismaClient.user.create({
            data: {
                email,
                passwordhash: hash,
            },
        });

        // Create token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 3600 });

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});
// Security Feature: Use JWT for stateless authentication
// The token is generated upon login and must be provided in subsequent requests
app.post('/api/auth/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Simple validation
    if (!email || !password) {
        return res.status(400).json({ message: 'Please enter all fields' });
    }

    try {
        // Check for existing user
        const user = await prismaClient.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }

        // Validate password and generate JWT token if valid
        const isMatch = await bcrypt.compare(password, user.passwordhash);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Create token
        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: 3600 });
        // Send the token to the client
        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

app.patch("/api/recipes/favorite/notes/:recipeId", async (req: Request, res: Response) => {
    const { recipeId } = req.params;
    const { notes } = req.body;

    // Simple validation
    if (!recipeId || !notes) {
        return res.status(400).json({ message: "Missing recipe ID or notes" });
    }

    try {
        const updatedFavorite = await prismaClient.favoriteRecipes.update({
            where: { recipeId: parseInt(recipeId) },
            data: { notes },
        });

        return res.json({
            message: "Notes updated successfully",
            updatedFavorite,
        });
    } catch (error) {
        console.error("Failed to update notes:", error);
        return res.status(500).json({ message: "Failed to update notes" });
    }
});

// Fetch details of a favorite recipe including notes
app.get("/api/recipes/favorite/details/:recipeId", async (req: Request, res: Response) => {
    const { recipeId } = req.params;

    try {
        const favoriteDetails = await prismaClient.favoriteRecipes.findUnique({
            where: { recipeId: parseInt(recipeId) },
        });

        if (!favoriteDetails) {
            return res.status(404).json({ message: "Favorite recipe not found" });
        }

        return res.json(favoriteDetails);
    } catch (error) {
        console.error("Failed to fetch favorite details:", error);
        return res.status(500).json({ message: "Failed to fetch favorite details" });
    }
});

const corsOptions = {
    origin: 'https://reciperepository.netlify.app',
    optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
