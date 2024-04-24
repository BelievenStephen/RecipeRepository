import express from "express";
import session from 'express-session';
import cors from "cors";
import { RecipeController } from "./controllers/RecipeController";
import passport from './config/passport-config';
import { PrismaClient } from '@prisma/client';
import { body, validationResult } from 'express-validator';
import jsonwebtoken from 'jsonwebtoken';
import { Request, Response } from 'express';
import * as RecipeAPI from "./recipe-api";

const app = express();
const recipeController = new RecipeController();
const prisma = new PrismaClient();
const { expressjwt: expressJwt } = require("express-jwt");
const helmet = require('helmet');
const checkJwt = expressJwt({
    secret: process.env.JWT_SECRET,
    algorithms: ['HS256'],
    requestProperty: 'auth'
});

// Security middleware
app.use(helmet());

// Apply rate limiter to all requests
app.use(apiLimiter);

// CORS middleware
app.use(cors());

// JSON middleware
app.use(express.json());


app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // true for production, false for local dev
        httpOnly: true
    }
    // production secure line: secure: process.env.NODE_ENV === 'production',
}));

app.use(passport.initialize());
app.use(passport.session());


app.get("/api/recipe/search", async (req: Request, res: Response) => {
    const searchTerm = req.query.searchTerm as string;
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;

    try {
        const results = await RecipeAPI.searchRecipes(searchTerm, page, pageSize);
        res.json(results);
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: 'Error fetching recipes' });
    }
});


app.listen(5000, () => {
    console.log("Server running on localhost:5000");
});

app.get('/api/protected', checkJwt, (req, res) => {
    res.send('Access to protected route');
});

app.post('/api/login', passport.authenticate('local', { session: false }), (req, res) => {
    const token = jsonwebtoken.sign({ id: req.user.id }, process.env.JWT_SECRET as string, { expiresIn: '1d' });
    res.json({ token });
});


// CRUD Operations:
// CREATE
app.post('/api/recipes', [
    body('title').isString().trim().notEmpty().withMessage('Title is required'),
    body('ingredients').isString().trim().notEmpty().withMessage('Ingredients are required'),
    body('steps').isString().trim().notEmpty().withMessage('Preparation steps are required'),
    body('userId').isInt().withMessage('User ID must be an integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, ingredients, steps, userId } = req.body;
    try {
        const newRecipe = await prisma.recipe.create({
            data: { title, ingredients, steps, userId }
        });
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).send({ error: 'Unable to create recipe' });
    }
});


// UPDATE
app.put('/api/recipes/:id', [
    body('title').optional().isString().trim(),
    body('ingredients').optional().isString().trim(),
    body('steps').optional().isString().trim(),
    body('id').toInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { title, ingredients, steps } = req.body;
    const { id } = req.params;
    try {
        const updatedRecipe = await prisma.recipe.update({
            where: { id },
            data: { title, ingredients, steps }
        });
        res.status(200).json(updatedRecipe);
    } catch (error) {
        res.status(500).send({ error: 'Unable to update recipe' });
    }
});


// DELETE
app.delete('/api/recipes/:id', checkJwt, [
    body('id').toInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    try {
        const recipe = await prisma.recipe.findUnique({ where: { id } });
        if (!recipe || recipe.userId !== req.auth.id) {
            return res.status(403).send({ error: 'You are not allowed to delete this recipe' });
        }
        await prisma.recipe.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: 'Unable to delete recipe' });
    }
});



// ADD FAVORITE
app.post('/api/favorites', checkJwt, [
    body('userId').isInt().withMessage('User ID must be an integer'),
    body('recipeId').isInt().withMessage('Recipe ID must be an integer')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { userId, recipeId } = req.body;
    if (userId !== req.auth.id) {
        return res.status(403).send({ error: 'Unauthorized action' });
    }

    try {
        const newFavorite = await prisma.favorite.create({
            data: {
                userId,
                recipeId
            }
        });
        res.status(201).json(newFavorite);
    } catch (error) {
        res.status(500).send({ error: 'Unable to add favorite' });
    }
});


// REMOVE FAVORITE
app.delete('/api/favorites/:id', checkJwt, [
    body('id').toInt()
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    try {
        const favorite = await prisma.favorite.findUnique({ where: { id } });
        if (!favorite || favorite.userId !== req.auth.id) {
            return res.status(403).send({ error: 'Unauthorized to remove this favorite' });
        }
        await prisma.favorite.delete({ where: { id } });
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: 'Unable to remove favorite' });
    }
});


// GET route for generating a favorites report
app.get('/api/reports/favorites', checkJwt, async (req, res) => {
    try {
        const favoritesCount = await prisma.favorite.groupBy({
            by: ['recipeId'],
            _count: true,
            orderBy: {
                _count: {
                    recipeId: 'desc'
                }
            }
        });
        const recipeIds = favoritesCount.map(fav => fav.recipeId);
        const recipes = await prisma.recipe.findMany({
            where: {
                id: { in: recipeIds }
            }
        });

        const report = recipes.map(recipe => {
            const count = favoritesCount.find(f => f.recipeId === recipe.id)?._count ?? 0;
            return {
                recipeTitle: recipe.title,
                favoritesCount: count,
                lastUpdated: recipe.updatedAt
            };
        });

        res.status(200).json({ report });
    } catch (error) {
        res.status(500).send({ error: 'Unable to generate report' });
    }
});

app.post('/api/path', async (req: Request, res: Response) => {

});

const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
});

app.use(session({
    secret: 'your-secret',
    cookie: {
        secure: true,
        httpOnly: true
    }
}));
