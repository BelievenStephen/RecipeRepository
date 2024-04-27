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

export const getFavoriteRecipesByIDs = async (ids: string[]) => {
    if (!API_KEY) {
        throw new Error("API Key not found");
    }

    const url = new URL("https://api.spoonacular.com/recipes/informationBulk");
    const params = {
        apiKey: API_KEY,
        ids: ids.join(","),
    };
    url.search = new URLSearchParams(params).toString();

    const searchResponse = await fetch(url);
    const json = await searchResponse.json();

    return { results: json };
};


/**
 * Abstract APIHandler class.
 * Illustrates OOP principles by providing a template for API handlers.
 * Encapsulates HTTP methods for extension by specific handlers, readying the code for easy scalability.
 * Enables inheritance, allowing derived classes to implement concrete method behaviors.
 */
abstract class APIHandler {
    protected abstract baseUrl: string;

    protected async get(endpoint: string, params: Record<string, string>): Promise<any> {
        const url = new URL(this.baseUrl + endpoint);
        url.search = new URLSearchParams(params).toString();

        throw new Error("GET method not implemented.");
    }
    protected async post(endpoint: string, body: Record<string, unknown>): Promise<any> {
        throw new Error("POST method not implemented.");
    }

    protected async put(endpoint: string, body: Record<string, unknown>): Promise<any> {
        throw new Error("PUT method not implemented.");
    }

    protected async delete(endpoint: string, body?: Record<string, unknown>): Promise<any> {
        throw new Error("DELETE method not implemented.");
    }
}

/**
 * SpoonacularAPIHandler class.
 * A concrete implementation of APIHandler tailored for the Spoonacular API.
 * Uses polymorphism to interact with various API handlers seamlessly, maintaining a uniform interface.
 */

class SpoonacularAPIHandler extends APIHandler {
    protected baseUrl: string = 'https://api.spoonacular.com';

    constructor(private apiKey: string) {
        super();
        if (!this.apiKey) {
            throw new Error('API key not found');
        }
    }

    async get(endpoint: string, params: Record<string, string>): Promise<any> {
        const url = new URL(this.baseUrl + endpoint);
        params['apiKey'] = this.apiKey; // Add API key to query params
        url.search = new URLSearchParams(params).toString();

        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`GET request failed with status: ${response.status}`);
        }
        return await response.json();
    }

    async post(endpoint: string, body: Record<string, unknown>): Promise<any> {
        const url = new URL(this.baseUrl + endpoint);
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': this.apiKey
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            throw new Error(`POST request failed with status: ${response.status}`);
        }
        return await response.json();
    }

    async put(endpoint: string, body: Record<string, unknown>): Promise<any> {
        const url = new URL(this.baseUrl + endpoint);
        const options = {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'apiKey': this.apiKey
            },
            body: JSON.stringify(body)
        };

        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            throw new Error(`PUT request failed with status: ${response.status}`);
        }
        return await response.json();
    }

    async delete(endpoint: string): Promise<any> {
        const url = new URL(this.baseUrl + endpoint + '?apiKey=' + this.apiKey);

        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const response = await fetch(url.toString(), options);
        if (!response.ok) {
            throw new Error(`DELETE request failed with status: ${response.status}`);
        }
        return await response.json();
    }
}

// Usage example:
// const spoonacularHandler = new SpoonacularAPIHandler(process.env.API_KEY);
// spoonacularHandler.get('/recipes/complexSearch', { query: 'pasta' })
//     .then(data => console.log(data))
//     .catch(error => console.error(error));