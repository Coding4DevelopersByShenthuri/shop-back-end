// routes/blogRoutes.js
const express = require('express');
const {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogById
} = require('../controllers/blogController'); // Ensure consistent capitalization in file paths if needed

const router = express.Router();

// GET all blogs
router.get('/', getAllBlogs);

// POST a new blog
router.post('/', createBlog);

// PUT to update a blog by ID
router.put('/:id', updateBlog);

// GET blog by ID
router.get('/blog/:id', getBlogById);

// DELETE a blog by ID
router.delete('/:id', deleteBlog);

module.exports = router;


