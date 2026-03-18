const Recipe = require('../models/recipeModel');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Get all recipes
const getAllRecipes = async (req, res, next) => {
  try {
    const recipes = await Recipe.find();
    sendSuccess(res, recipes, 'Recipes fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Create a new recipe
const createRecipe = async (req, res, next) => {
  try {
    const { title, description, ingredients, steps, imageUrl, category } = req.body;
    const recipe = new Recipe({ title, description, ingredients, steps, imageUrl, category });
    const savedRecipe = await recipe.save();
    sendSuccess(res, savedRecipe, 'Recipe created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Update a recipe
const updateRecipe = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { title, description, ingredients, steps, imageUrl, category } = req.body;
    const updatedRecipe = await Recipe.findByIdAndUpdate(
      id,
      { title, description, ingredients, steps, imageUrl, category },
      { new: true, runValidators: true }
    );
    if (!updatedRecipe) {
      return sendError(res, 'Recipe not found', 404);
    }
    sendSuccess(res, updatedRecipe, 'Recipe updated successfully');
  } catch (error) {
    next(error);
  }
};

// Delete a recipe
const deleteRecipe = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Recipe.findByIdAndDelete(id);
    if (!result) {
      return sendError(res, 'Recipe not found', 404);
    }
    sendSuccess(res, null, 'Recipe deleted successfully');
  } catch (error) {
    next(error);
  }
};

const getRecipeById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const recipe = await Recipe.findById(id);
    if (!recipe) {
      return sendError(res, 'Recipe not found', 404);
    }
    sendSuccess(res, recipe, 'Recipe fetched successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  createRecipe,
  updateRecipe,
  deleteRecipe,
  getRecipeById
};
