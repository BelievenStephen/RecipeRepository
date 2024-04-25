const searchRecipes = async (searchTerm: string, page: number) => {
    const baseURL = new URL("http://localhost:5000/api/recipe/search");
    baseURL.searchParams.append("searchTerm", searchTerm);
    baseURL.searchParams.append("page", page.toString());

    const response = await fetch(baseURL.toString());

    if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
    }

    return response.json();
};

export { searchRecipes };

export const getRecipeSummary = async (recipeId: string) => {
    const url = new URL(`http://localhost:5000/api/recipes/${recipeId}/summary`);
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.json();
};