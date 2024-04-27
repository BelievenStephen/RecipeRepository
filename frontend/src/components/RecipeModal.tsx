import { useEffect, useState } from "react";
import { RecipeSummary } from "../types";
import * as RecipeAPI from "../API";

interface Props {
    recipeId: string;
    onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: Props) => {
    const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();
    const [notes, setNotes] = useState('');
    const [savedNotes, setSavedNotes] = useState('');

    useEffect(() => {
        const fetchRecipeSummary = async () => {
            try {
                const summaryRecipe = await RecipeAPI.getRecipeSummary(recipeId);
                setRecipeSummary(summaryRecipe);
                const favoriteDetails = await RecipeAPI.getFavoriteDetails(recipeId);
                if (favoriteDetails && favoriteDetails.notes) {
                    setSavedNotes(favoriteDetails.notes);
                    setNotes(favoriteDetails.notes);
                }
            } catch (error) {
                console.log(error);
            }
        };

        fetchRecipeSummary();
    }, [recipeId]);

    const handleSaveNotes = async () => {
        try {
            await RecipeAPI.saveNotes(recipeId, notes);
            setSavedNotes(notes);
            alert('Notes saved successfully!');
        } catch (error) {
            console.error('Failed to save notes:', error);
            alert('Failed to save notes. Please try again.');
        }
    };

    if (!recipeSummary) {
        return <></>;
    }

    return (
        <>
            <div className="overlay"></div>
            <div className="modal">
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>{recipeSummary.title}</h2>
                        <span className="close-btn" onClick={onClose}>&times;</span>
                    </div>
                    <p dangerouslySetInnerHTML={{__html: recipeSummary.summary}}></p>
                    {savedNotes && (
                        <div>
                            <h3>Notes</h3>
                            <p>{savedNotes}</p>
                        </div>
                    )}
                    <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add or edit notes here..."
                        rows={5}
                        style={{width: '100%'}}
                    />
                    <button onClick={handleSaveNotes}>Save Notes</button>
                </div>
            </div>
        </>
    );
};

export default RecipeModal;