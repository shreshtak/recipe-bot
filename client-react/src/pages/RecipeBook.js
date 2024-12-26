import React, { useEffect, useState } from 'react';
import DropdownMenu from '../components/DropdownMenu';
import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '../App.css'
import database from '../firebase';
import {ref, onValue} from "firebase/database";
import RecipePage from './RecipePage';
import { useNavigate } from 'react-router-dom';


function RecipeBook() {
  const [recipes, setRecipes] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const recipesRef = ref(database, "recipes");
    onValue(recipesRef, (snapshot) => {
      const data = snapshot.val();

      if (data) {
        // Convert the object into an array
        const recipeList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRecipes(recipeList);
      } else {
        setRecipes([]); // If no data exists, set to an empty array
      }
    });
  }, []);


  return (
    <div>
      <div>
      <DropdownMenu />
      <h1 className='title'>Your Recipe Book</h1>
      </div>
      <div className='recipe-book'>
        <Grid2 container spacing={3} justifyContent="center" alignItems="center">
        {recipes.map((recipe, index) => (
          <Grid2 item xs={12} sm={6} md={4} key={index}>
            <Card 
              className="recipe-card"
              style={{fontFamily: "Gaegu"}}
            >
              <CardContent>
                <Typography variant="h5" component="h2" style={{ fontFamily: "Gaegu, serif" }}>
                  {recipe.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p" style={{ fontFamily: "Gaegu, serif" }}>
                  {recipe.description}
                </Typography>
                <button 
                  className='view-recipe-button'
                  onClick={() => {navigate('/recipe/' + recipe.id)}}>
                  View recipe
                </button>
              </CardContent>
            </Card>
          </Grid2>
        ))}
        </Grid2>
      </div>
      
    </div>
  ) 
}

export default RecipeBook;
