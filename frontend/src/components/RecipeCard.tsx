import { Recipe } from "../types";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";


interface Props {
    recipe: Recipe;
    isFavorite: boolean;
    onClick: () => void;
    onFavoriteButtonClick: (recipe: Recipe) => void;
}

const RecipeCard = ({ recipe,
                        onClick,
                        onFavoriteButtonClick,
                        isFavorite, }: Props) => {
    return (
        <div className="recipe-card" onClick={onClick}>
            <img src={recipe.image}></img>
            <div className="recipe-card-title">
                <span
                    onClick={(event) => {
                        event.stopPropagation();
                        onFavoriteButtonClick(recipe);
                    }}
                >
                    {isFavorite ? (
                        <AiFillStar size={25} color="gold" />
                    ) : (
                        <AiOutlineStar size={25}/>
                    )}
                </span>
                <h3>{recipe.title}</h3>
            </div>
        </div>
    );
};

export default RecipeCard;