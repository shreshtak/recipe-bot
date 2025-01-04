import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AskChefGPT from './pages/AskChefGPT'
import RecipeBook from './pages/RecipeBook';
import RecipePage from './pages/RecipePage';
import Login from "./pages/Login"
import Signup from './pages/Signup';
import Logout from './pages/Logout';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} /> 
        <Route path="/askchefgpt" element={<AskChefGPT />} />
        <Route path="/recipebook" element={<RecipeBook />} />
        <Route path="/recipe/:id" element={<RecipePage />} /> 
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
    </div>
  );
}

export default App;