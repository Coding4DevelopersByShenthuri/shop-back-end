const Blog = require('../models/blogModel');

// Get all Blogs
const getAllBlogs = async (req, res) => {
  try {
    const Blogs = await Blog.find();
    res.json(Blogs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching Blogs', error });
  }
};

// Create a new Blog
const createBlog = async (req, res) => {
  const { title, content,  imageUrl, category } = req.body;
  const Blog = new Blog({ title, content,  imageUrl, category });

  try {
    const savedBlog = await Blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    res.status(400).json({ message: 'Error creating Blog', error });
  }
};

// Update a Blog
const updateBlog = async (req, res) => {
  const { id } = req.params;
  const { title, content,  imageUrl, category } = req.body;

  try {
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content,  imageUrl, category },
      { new: true, runValidators: true }
    );
    res.json(updatedBlog);
  } catch (error) {
    res.status(400).json({ message: 'Error updating Blog', error });
  }
};

// Delete a Blog
const deleteBlog = async (req, res) => {
  const { id } = req.params;

  try {
    await Blog.findByIdAndDelete(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error deleting Blog', error });
  }
};

module.exports = {
  getAllBlogs,
  createBlog,
  updateBlog,
  deleteBlog,
};
