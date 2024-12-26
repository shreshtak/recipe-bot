import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import DropdownMenu from "../components/DropdownMenu";
import database from "../firebase";
import { ref, onValue } from "firebase/database";
import Markdown from "react-markdown";

const RecipePage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);  // Adding a loading state
    
    useEffect(() => {
        const recipeRef = ref(database, `recipes/${id}`);
        onValue(recipeRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setRecipe(data); 
            } else {
                setRecipe(null); 
            }
            setLoading(false); 
        });
    }, [id]);

    if (loading) {
        return <p>Loading...</p>; 
    }

    if (!recipe) {
        return <p>Recipe not found.</p>;
    }

    return (
        <div>
            <DropdownMenu />
            <h1 className="title">{recipe.title}</h1>
            <h4 className="recipe-description">{recipe.description}</h4>
            <div className="recipe-text">
                <Markdown>{recipe.recipe}</Markdown>
            </div>
        </div>
    );
};

export default RecipePage;
