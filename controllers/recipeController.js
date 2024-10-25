const Recipe = require('../models/recipeModel');

// Get all recipes
const getAllRecipes = async (req, res) => {
  try {
    const recipes = await Recipe.find();
    res.json(recipes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recipes', error });
  }
};

// Create a new recipe
const createRecipe = async (req, res) => {
  const { title, description, ingredients, steps, imageUrl } = req.body;
  const recipe = new Recipe({ title, description, ingredients, steps, imageUrl });

  try {
    const savedRecipe = await recipe.save();
    res.status(201).json(savedRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error creating recipe', error });
  }
};

// Update a recipe
const updateRecipe = async (req, res) => {
  const { id } = req.params;
  const { title, description, ingredients, steps, imageUrl } = req.body;

  try {
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { title, description, ingredients, steps, imageUrl },
      { new: true, runValidators: true }
    );
    res.json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ message: 'Error updating recipe', error });
  }
};

// Delete a recipe
const deleteRecipe = async (req, res) => {
  const { id } = req.params;

  try {
    await Recipe.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting recipe', error });
  }
};

module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
