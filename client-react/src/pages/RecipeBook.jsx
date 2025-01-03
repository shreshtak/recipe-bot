import React, { useEffect, useState } from 'react';
import DropdownMenu from '../components/DropdownMenu';
import {Grid2} from '@mui/material';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import '../App.css'
import database, {auth} from '../firebase';
import {ref, onValue, remove} from "firebase/database";
import { useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from "firebase/auth";

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});


function RecipeBook() {
  const [recipes, setRecipes] = useState([])
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState(null); // Store user email
  const [open, setOpen] = useState(false); // Track dialog open state
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // Track the selected recipe for deletion

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

  const handleOpenDialog = (id) => {
    setSelectedRecipeId(id);
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setSelectedRecipeId(null);
  };

  const confirmRemoveRecipe = () => {
    if (selectedRecipeId) {
      const recipesRef = ref(database, `users/${userEmail}/recipes/${selectedRecipeId}`);
      remove(recipesRef);
    }
    handleCloseDialog();
  };

  // const removeRecipe = (id) => {
  //   const recipesRef = ref(database, `users/${userEmail}/recipes/${id}`);
  //   remove(recipesRef)
  // }

  return (
    <div>
      <div>
        <DropdownMenu />
        <h1 className='title'>Your Recipe Book</h1>
      </div>
      <div className='recipe-book' style={{ "textAlign": "center", "fontSize": "larger"}}>
        {recipes.length === 0 ? (
            <h3 style={{ "textAlign": "center"}}> Recipe book is empty.</h3>
        ) : (
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
                    <button
                      className='remove-recipe-button'
                      onClick={() => handleOpenDialog(recipe.id)}
                    >
                      Remove recipe
                    </button>
                  </CardContent>
                </Card>
              </Grid2>
            ))}
          </Grid2>
        )}
        <button onClick={() => navigate("/askchefgpt")} className='add-recipe-btn'> Add recipe </button> 
      </div>

      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleCloseDialog}
        aria-describedby='alert-dialog-slide-description'
      >
        <DialogTitle sx={{ fontFamily: 'Gaegu, serif' }}>{'Remove this recipe?'}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontFamily: 'Gaegu, serif' }} id='alert-dialog-slide-description'>
            This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button sx={{ fontFamily: 'Gaegu, serif' }} onClick={handleCloseDialog}>Cancel</Button>
          <Button sx={{ fontFamily: 'Gaegu, serif' }} onClick={confirmRemoveRecipe}>Remove</Button>
        </DialogActions>
      </Dialog>
    </div>
  ) 
}

export default RecipeBook;
