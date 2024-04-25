import "./App.css";
import {useState, FormEvent, useRef, useEffect} from 'react';
import * as api from "./API";
import { Recipe } from './types';
import RecipeCard from "./components/RecipeCard.tsx";
import RecipeModal from "./components/RecipeModal.tsx";
import {AiOutlineSearch} from "react-icons/ai";


type Tabs = "search" | "favorites";

const App = () => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
        undefined)
    const [selectedTab, setSelectedTab] = useState<Tabs>("search");
    const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
    const pageNumber = useRef(1);

    useEffect(() => {
        const fetchFavoriteRecipes = async () => {
            try {
                const favoriteRecipes = await api.getFavoriteRecipes();
                setFavoriteRecipes(favoriteRecipes.results);
            } catch (error) {
                console.log(error);
            }
        };
        fetchFavoriteRecipes();
    }, []);

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

    const addFavoriteRecipe = async (recipe: Recipe) => {
        try {
            await api.addFavoriteRecipe(recipe);
            setFavoriteRecipes([...favoriteRecipes, recipe]);
        } catch (error) {
            console.log(error);
        }
    };

    const removeFavoriteRecipe = async (recipe: Recipe) => {
        try {
            await api.removeFavoriteRecipe(recipe);
            const updatedRecipes = favoriteRecipes.filter(
                (favRecipe) => recipe.id !== favRecipe.id
            );
            setFavoriteRecipes(updatedRecipes);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div className="tabs">
                <h1
                    // className={selectedTab === "search" ? "tab-active" : ""}
                    onClick={() => setSelectedTab("search")}
                >
                    Recipe Search
                </h1>
                <h1
                    // className={selectedTab === "favorites" ? "tab-active" : ""}
                    onClick={() => setSelectedTab("favorites")}
                >
                    Favorites
                </h1>
            </div>

            {selectedTab === "search" && (
                <>
                    <form onSubmit={(event) => handleSearchSubmit(event)}>
                        <input
                            type="text"
                            required
                            placeholder="Enter a search term ..."
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                        ></input>
                        <button type="submit">
                            <AiOutlineSearch size={25} />
                        </button>
                    </form>

                    <div className="recipe-grid">
                        {recipes.map((recipe) => {
                            const isFavorite = favoriteRecipes.some(
                                (favRecipe) => recipe.id === favRecipe.id
                            );

                            return (
                                <RecipeCard
                                    recipe={recipe}
                                    onClick={() => setSelectedRecipe(recipe)}
                                    onFavoriteButtonClick={
                                        isFavorite ? removeFavoriteRecipe : addFavoriteRecipe
                                    }
                                    isFavorite={isFavorite}
                                />
                            );
                        })}
                    </div>

                    <button className="view-more-button" onClick={handleViewMoreClick}>
                        View More
                    </button>
                </>
            )}

            {selectedTab === "favorites" && (
                <div className="recipe-grid">
                    {favoriteRecipes.map((recipe) => (
                        <RecipeCard
                            recipe={recipe}
                            onClick={() => setSelectedRecipe(recipe)}
                            onFavoriteButtonClick={removeFavoriteRecipe}
                            isFavorite={true}
                        />
                    ))}
                </div>
            )}


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