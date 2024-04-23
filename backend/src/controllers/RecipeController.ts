import { BaseController } from './BaseController';
import { RecipeService } from '../services/RecipeService';
import { Request, Response } from 'express';

export class RecipeController extends BaseController {
    private recipeService: RecipeService;

    constructor() {
        super();
        this.recipeService = new RecipeService();
    }

    public async search(req: Request, res: Response) {
        try {
            const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
            const result = await this.recipeService.searchRecipes(req.query.searchTerm as string, page);
            this.sendResponse(res, 200, result);
        } catch (error) {
            this.sendResponse(res, 500, { error: error.message });
        }
    }
}
