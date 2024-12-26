import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DropdownMenu from './components/DropdownMenu';
import AskChefGPT from './pages/AskChefGPT'
import RecipeBook from './pages/RecipeBook';
import RecipePage from './pages/RecipePage';

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<AskChefGPT />} />
        <Route path="/askchefgpt" element={<AskChefGPT />} />
        <Route path="/recipebook" element={<RecipeBook />} />
        <Route path="/recipe/:id" element={<RecipePage />} />
        {/* <Route path="/logout" element={<Logout />} /> */}
      </Routes>
    </div>
  );
}

export default App;
