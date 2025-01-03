import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "../App.css";
import DropdownMenu from "../components/DropdownMenu";
import database, {auth} from "../firebase";
import { ref, onValue } from "firebase/database";
import Markdown from "react-markdown";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";


const RecipePage = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);  // Adding a loading state
    const [userEmail, setUserEmail] = useState(null); // Store user email
    const navigate = useNavigate();
    
    // Fetch user email
    useEffect(() => {

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("email: " + user.email)
                // Replace dots in email to match Firebase key structure
                const encodedEmail = user.email.replace(/\./g, "_");
                setUserEmail(encodedEmail);
                console.log('encoded email: ' + userEmail)
            } else {
                setUserEmail(null); // No user logged in
            }
        });

        return () => unsubscribe(); // Cleanup subscription
    }, []);

    useEffect(() => {
        if (!userEmail) return; // Wait until userEmail is available
        console.log("user email: " + userEmail);
    
        const recipeRef = ref(database, `users/${userEmail}/recipes/${id}`);
        onValue(recipeRef, (snapshot) => {
            const data = snapshot.val();
            console.log(data);
            if (data) {
                setRecipe(data);
            } else {
                setRecipe(null);
            }
            setLoading(false);
        });
    }, [id, userEmail]); // Add userEmail as a dependency
    

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
            <button className="recipe-page-back" onClick={() => navigate(-1)}>Back</button>
            <div className="recipe-text">
                <Markdown>{recipe.recipe}</Markdown>
            </div>
        </div>
    );
};

export default RecipePage;
