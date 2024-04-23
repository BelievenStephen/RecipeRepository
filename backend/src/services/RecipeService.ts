import { Recipe } from '../models/Recipe';

export class RecipeService {
    async searchRecipes(searchTerm: string, page: number): Promise<Recipe[]> {
        return new Promise((resolve, reject) => {
            // TODO: Implement the logic to search for recipes
            resolve([]);
        });
    }
}
