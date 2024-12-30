import React, { useEffect, useState } from 'react';
import DropdownMenu from '../components/DropdownMenu';
import Grid2 from '@mui/material/Grid2';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '../App.css'
import database, {auth} from '../firebase';
import {ref, onValue} from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";


function RecipeBook() {
  const [recipes, setRecipes] = useState([])
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null); // Store user email

  // Fetch user email
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Replace dots in email to match Firebase key structure
        const encodedEmail = user.email.replace(/\./g, "_");
        setUserEmail(encodedEmail);
      } else {
        setUserEmail(null); // No user logged in
      }
    });

    return () => unsubscribe(); // Cleanup subscription
  }, []);

  // Fetch user's recipes
  useEffect(() => {
    if (!userEmail) return;

    const recipesRef = ref(database, `users/${userEmail}/recipes`);

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
  }, [userEmail]); // Refetch recipes when userEmail changes


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
              style={{fontFamily: "Gaegu", backgroundColor: "#e3ded4"}}
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
