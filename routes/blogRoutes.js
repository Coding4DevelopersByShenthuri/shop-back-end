const express = require('express');
const {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/BlogController');

const router = express.Router();

// Route to get all blogs
router.get('/', getAllBlogs);

// Route to create a new blog
router.post('/', createBlog);

// Route to update a blog by ID
router.put('/:id', updateBlog);

// Route to delete a blog by ID
router.delete('/:id', deleteBlog);

module.exports = router;

