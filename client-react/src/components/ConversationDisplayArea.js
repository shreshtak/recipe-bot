import React, { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import userIcon from '../assets/user-icon.png';
// TODO: Consider replacing chatbotIcon with its own distinct icon.
import chatbotIcon from '../assets/chef-icon.png'
import { Button } from 'react-bootstrap';
import { onAuthStateChanged } from "firebase/auth";
import { ref, push, set } from "firebase/database";
import database, {auth} from '../firebase';
import { getRecipeTitle, getRecipeDescription } from '../pages/AskChefGPT';

const ChatArea = ({ data, streamdiv, answer }) => {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Encode email to replace '.' with '_' for Firebase keys
        setUserEmail(user.email.replace(/\./g, "_"));
      } else {
        setUserEmail(null);
      }
    });
    return unsubscribe;
  }, []);

  const saveToRecipeBook = async (response) => {

    if (isCookingRecipe(response)) {
      try {
        const title = await getRecipeTitle(response);
        const description = await getRecipeDescription(response);
        const timestamp = new Date().toISOString();

        const recipeRef = ref(
          database,
          `users/${userEmail}/recipes/`
        );

        // Push a new recipe under a unique ID
        const newRecipeRef = push(recipeRef);

        // Save recipe data to the database
        await set(newRecipeRef, {
          id: newRecipeRef.key, // Store the unique ID
          title,
          recipe: response,
          description,
          timestamp,
        });

        alert("Recipe saved successfully!");
      } catch (error) {
        console.error("Error saving recipe:", error);
        alert("Failed to save the recipe. Please try again.");
      }
    } else {
      alert("This response is not a valid cooking recipe.");
    }
  };
  
  
  // helper function to validate a recipe
  const isCookingRecipe = (response) => {
    // check for keywords like "ingredients", "instructions", "cook", etc.
    const recipeKeywords = ["ingredients", "instructions", "cook", "bake", "recipe"];
    return recipeKeywords.some((keyword) => response.toLowerCase().includes(keyword));
  };


  return (
    <div className="chat-area">
      {data?.length <= 0 ? (
        <div className="welcome-area">
          <p className="welcome-1">Hello Chef!</p>
          <p className="welcome-2">What can I help you cook today?</p>
        </div>
      ) : (
        <div className="welcome-area" style={{display: "none"}}></div>
      )}

      {data.map((element, index) => (
        <div key={index} className={`chat-bubble ${element.role}`}>
          <img 
            src={element.role === "user" ? userIcon : chatbotIcon} 
            alt="Icon" 
          />
          <div className="message-content">
            <p><Markdown children={element.parts[0].text} /></p>
            {element.role === "model" && (
              <div className="save-recipe-container">
                <button
                  onClick={() => saveToRecipeBook(element.parts[0].text)}
                  className="save-recipe-button"
                >
                  Save to Recipe Book
                </button>
              </div>
            )}
          </div>
        </div>
      ))}


      {streamdiv && (
        <div className="tempResponse">
          <img src={chatbotIcon} alt="Icon" />
          {answer && <p><Markdown children={answer} /></p>}
          
        </div>
      )}

      <span id="checkpoint"></span>
    </div>
  );
};

export default ChatArea;