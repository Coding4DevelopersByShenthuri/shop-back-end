const express = require('express');
const {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById
} = require('../controllers/recipeController');

const router = express.Router();

router.get('/', getAllRecipes);
router.get('/recipes/:id', getRecipeById);
router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);

module.exports = router;
