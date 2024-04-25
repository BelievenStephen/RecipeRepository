import "./App.css";
import { useState, FormEvent, useRef } from 'react';
import * as api from "./API";
import { Recipe } from './types';
import RecipeCard from "./components/RecipeCard.tsx";
import RecipeModal from "./components/RecipeModal.tsx";


const App = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
        undefined)
    const pageNumber = useRef(1);

    const handleSearchSubmit = async (event: FormEvent) => {
        event.preventDefault();
        try {
            const { results } = await api.searchRecipes(searchTerm, 1);
            setRecipes(results);
            pageNumber.current = 1;
        } catch (error) {
            console.error(error);
        }
    };

    const handleViewMoreClick = async () => {
        const nextPage = pageNumber.current + 1;
        try {
            const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
            setRecipes([...recipes, ...nextRecipes.results]);
            pageNumber.current = nextPage;
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <form onSubmit={handleSearchSubmit}>
                <input
                    type="text"
                    required
                    placeholder="Enter a search term"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />
                <button type="submit">Submit</button>
            </form>
            {recipes.map((recipe) => (
                <RecipeCard recipe={recipe} onClick={()=> setSelectedRecipe(recipe)}/>
            ))}
            <button className="view-more-button" onClick={handleViewMoreClick}>
                View More
            </button>


            {selectedRecipe ? (
                <RecipeModal
                    recipeId={selectedRecipe.id.toString()}
                    onClose={() => setSelectedRecipe(undefined)}
                />
            ) : null}

        </div>
    );
};


export default App;