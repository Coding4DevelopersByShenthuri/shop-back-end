const express = require('express');
const {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
} = require('../controllers/BlogController');

const router = express.Router();

router.get('/', getAllBlogs);
router.post('/', createBlog);
router.put('/:id', updateBlog);
router.delete('/:id', deleteBlog);

module.exports = router;

