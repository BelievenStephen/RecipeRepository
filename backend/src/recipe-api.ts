const API_KEY = process.env.API_KEY;

export const searchRecipes = async (searchTerm: string, page: number, pageSize: number = 10) => {
    if (!API_KEY) {
        throw new Error("API key not found");
    }

    const baseURL = "https://api.spoonacular.com/recipes/complexSearch";
    const url = new URL(baseURL);

    const offset = (page - 1) * pageSize;

    const queryParams = {
        apiKey: API_KEY,
        query: searchTerm,
        number: pageSize.toString(),
        offset: offset.toString(),
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
