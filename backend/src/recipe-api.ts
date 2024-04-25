const API_KEY = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page: number) => {
    if (!API_KEY) {
        throw new Error("API key not found");
    }

    const baseURL = "https://api.spoonacular.com/recipes/complexSearch";
    const url = new URL(baseURL);

    const queryParams = {
        apiKey: API_KEY,
        query: searchTerm,
        number: '10',
        offset: ((page - 1) * 10).toString(),
    };

    url.search = new URLSearchParams(queryParams).toString();

    try {
        const searchResponse = await fetch(url.toString());
        const resultsJson = await searchResponse.json();
        return resultsJson;
    } catch (error) {
        console.error(error);
    }
};

export const getRecipeSummary = async (recipeId: string) => {
    if (!API_KEY) {
        throw new Error("API Key not found");
    }

    const url = new URL(
        `https://api.spoonacular.com/recipes/${recipeId}/summary`
    );
    const params = {
        apiKey: API_KEY,
    };
    url.search = new URLSearchParams(params).toString();

    const response = await fetch(url);
    const json = await response.json();

    return json;
};
