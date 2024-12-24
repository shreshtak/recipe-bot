import React, { useState, useRef } from 'react';
import axios from 'axios';
import { flushSync } from 'react-dom';
import { Routes, Route } from 'react-router-dom';

import '../App.css';

/** Import necessary components. */
import ConversationDisplayArea from '../components/ConversationDisplayArea.js';
import MessageInput from '../components/MessageInput.js';
import DropdownMenu from '../components/DropdownMenu.js';

const AskChefGPT = () => {
  /** Reference variable for message input button. */
  const inputRef = useRef();
  /** Host URL */
  const host = "http://localhost:9000"
  /** URL for streaming chat. */
  const streamUrl = host + "/stream";
  /** State variable for message history. */
  const [data, setData] = useState([]);
  /** State variable for Temporary streaming block. */
  const [answer, setAnswer] = useState("")
  /** State variable to show/hide temporary streaming block. */
  const [streamdiv, showStreamdiv] = useState(false);
  /** 
   * State variable used to block the user from inputting the next message until
   * the previous conversation is completed.
   */
  const [waiting, setWaiting] = useState(false);
  
  // stores all saved recipe responses
  // const [recipeBook, setRecipeBook] = useState([]);


  /** Function to scroll smoothly to the top of the mentioned checkpoint. */
  function executeScroll() {
    const element = document.getElementById('checkpoint');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  /** Function to validate user input. */
  function validationCheck(str) {
    return str === null || str.match(/^\s*$/) !== null;
  }

  /** Handle form submission. */
  const handleClick = () => {
    if (validationCheck(inputRef.current.value)) {
      console.log("Empty or invalid entry");
    } else {
      handleStreamingChat();
    }
  };

  /** Handle streaming chat. */
  const handleStreamingChat = async () => {
    /** Prepare POST request data. */
    const chatData = {
      chat: `You're a helpful cooking assistant. If the prompt is not related to recipes and cooking, do not answer \
      the prompt and tell the user to submit a cooking-related prompt instead. Answer the following in a culinary context: ${inputRef.current.value}. \
      Respond like a nice version of Gordon Ramsey.`,
      history: data
    };

    /** Add current user message to history. */
    const ndata = [...data,
      {"role": "user", "parts":[{"text": inputRef.current.value}]}]

    /**
     * Re-render DOM with updated history.
     * Clear the input box and temporarily disable input.
     */
    flushSync(() => {
      setData(ndata);
      inputRef.current.value = ""
      inputRef.current.placeholder = "Waiting for model's response"
      setWaiting(true)
    });

    /** Scroll to the new user message. */
    executeScroll();

    /** Headers for the POST request. */
    let headerConfig = {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
    }

    /** Function to perform POST request. */
    const fetchStreamData = async() => {
      try {
        setAnswer("");
        const response = await fetch(streamUrl, {
          method: "post",
          headers: headerConfig,
          body: JSON.stringify(chatData),
        });

        if (!response.ok || !response.body) {
          throw response.statusText;
        }

        /** 
         * Creates a reader using ReadableStream interface and locks the
         * stream to it.
         */
        const reader = response.body.getReader();
        /** Create a decoder to read the stream as JavaScript string. */
        const txtdecoder = new TextDecoder();
        const loop = true;
        var modelResponse = "";
        /** Activate the temporary div to show the streaming response. */
        showStreamdiv(true);

        /** Loop until the streaming response ends. */
        while (loop) {
          const { value, done } = await reader.read();
          if (done) {
            break;
          }
          /**
           * Decode the partial response received and update the temporary
           * div with it.
           */
          const decodedTxt = txtdecoder.decode(value, { stream: true });
          setAnswer((answer) => answer + decodedTxt);
          modelResponse = modelResponse + decodedTxt;
          executeScroll();
        }
      } catch (err) {
        modelResponse = "Error occurred";
      } finally {
        /** Clear temporary div content. */
        setAnswer("")
        /** Add the complete model response to the history. */
        const updatedData = [...ndata,
          {"role": "model", "parts":[{"text": modelResponse}]}]
        /** 
         * Re-render DOM with updated history.
         * Enable input.
         */
        flushSync(() => {
          setData(updatedData);
          inputRef.current.placeholder = "Enter a message."
          setWaiting(false)
        });
        /** Hide temporary div used for streaming content. */
        showStreamdiv(false);
        /** Scroll to the new model response. */
        executeScroll();
      }
    };
    fetchStreamData();
  };

  // const saveToRecipeBook = (response) => {
  //   // check if the response is a valid recipe
  //   if (isCookingRecipe(response)) {
  //     setRecipeBook((prevRecipes) => [...prevRecipes, response]);
  //     alert("Recipe saved successfully!");
  //   } else {
  //     alert("This response is not a valid cooking recipe.");
  //   }
  // };
  
  // // helper function to validate a recipe
  // const isCookingRecipe = (response) => {
  //   // check for keywords like "ingredients", "instructions", "cook", etc.
  //   const recipeKeywords = ["ingredients", "instructions", "cook", "bake", "recipe"];
  //   return recipeKeywords.some((keyword) => response.toLowerCase().includes(keyword));
  // };

  

  return (
    <div>
      {/* <Routes>
        <Route path="/askchefgpt" element={<App />} />
      </Routes> */}
      <div>
        <DropdownMenu />
        <h1 className='title'>ChefGPT</h1>
      </div>
      <center>
        <div className="chat-app">
          <ConversationDisplayArea 
            data={data} 
            streamdiv={streamdiv} 
            answer={answer} 
          />
          <MessageInput inputRef={inputRef} waiting={waiting} handleClick={handleClick} />
        </div>
      </center>
    </div>
  );
}

export default AskChefGPT;