import { Recipe } from "./types";

export const searchRecipes = async (searchTerm: string, page: number) => {
    const baseURL = new URL("https://thereciperepository-e51f4c5c6e52.herokuapp.com/api/recipe/search");
    baseURL.searchParams.append("searchTerm", searchTerm);
    baseURL.searchParams.append("page", page.toString());

    const response = await fetch(baseURL.toString());

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return response.json();
};

export const getRecipeSummary = async (recipeId: string) => {
    const url = new URL(`https://thereciperepository-e51f4c5c6e52.herokuapp.com/api/recipes/${recipeId}/summary`);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
};

export const getFavoriteRecipes = async () => {
    const url = new URL("https://thereciperepository-e51f4c5c6e52.herokuapp.com/api/recipes/favorite");
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
};

export const addFavoriteRecipe = async (recipe: Recipe) => {
    const url = new URL("https://thereciperepository-e51f4c5c6e52.herokuapp.com/api/recipes/favorite");
    const body = {
        recipeId: recipe.id,
    };
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
};

export const removeFavoriteRecipe = async (recipe: Recipe) => {
    const url = new URL("https://thereciperepository-e51f4c5c6e52.herokuapp.com/api/recipes/favorite");
    const body = {
        recipeId: recipe.id,
    };
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
};

const API_URL = 'https://thereciperepository-e51f4c5c6e52.herokuapp.com/';

export const getFavoriteDetails = async (recipeId: string) => {
    try {
        const response = await fetch(`${API_URL}/recipes/favorite/details/${recipeId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch favorite details');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching favorite details:', error);
        throw error;
    }
};

export const saveNotes = async (recipeId: string, notes: string) => {
    try {
        const response = await fetch(`https://thereciperepository-e51f4c5c6e52.herokuapp.com/recipes/favorite/notes/${recipeId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ notes })
        });

        if (!response.ok) {
            const errorResponse = await response.json();
            throw new Error(errorResponse.message || 'Failed to save notes');
        }

        return await response.json();
    } catch (error) {
        console.error('Error saving notes:', error);
        throw error;
    }
};

