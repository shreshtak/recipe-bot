import React from 'react';
import Markdown from 'react-markdown';
import userIcon from '../assets/user-icon.png';
// TODO: Consider replacing chatbotIcon with its own distinct icon.
import chatbotIcon from '../assets/chef-icon.png'
import { Button } from 'react-bootstrap';
import { useState } from 'react';

import { ref, push } from "firebase/database";
import database from '../firebase';
import { getRecipeTitle, getRecipeDescription } from '../pages/AskChefGPT';

const ChatArea = ({ data, streamdiv, answer }) => {

  const saveToRecipeBook = async (response) => {
    if (isCookingRecipe(response)) {

      const recipeRef = ref(database, "recipes");
      const title = await getRecipeTitle(response); 
      const description = await getRecipeDescription(response);
      push(recipeRef, {
        title: title,
        recipe: response,
        description: description
      });

      // use this once userIDs are created, recipes/userID ->push creates a recipe ID for each one
      // set(ref(database, 'recipes/' + ), {
      //   title: title,
      //   recipe: response,
      // });
  
      alert("Recipe saved successfully!");
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