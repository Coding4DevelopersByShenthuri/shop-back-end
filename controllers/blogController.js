const Blog = require('../models/blogModel');
const { sendSuccess, sendError } = require('../utils/responseHelper');

// Get all Blogs
const getAllBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find();
    sendSuccess(res, blogs, 'Blogs fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Get a Blog by ID
const getBlogById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findById(id);
    if (!blog) {
      return sendError(res, 'Blog not found', 404);
    }
    sendSuccess(res, blog, 'Blog fetched successfully');
  } catch (error) {
    next(error);
  }
};

// Create a new Blog
const createBlog = async (req, res, next) => {
  try {
    const { title, content, imageUrl, category, tags } = req.body;
    const newBlog = new Blog({ title, content, imageUrl, category, tags });
    const savedBlog = await newBlog.save();
    sendSuccess(res, savedBlog, 'Blog created successfully', 201);
  } catch (error) {
    next(error);
  }
};

// Update a Blog
const updateBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const { title, content, imageUrl, category, tags } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, imageUrl, category, tags },
      { new: true, runValidators: true }
    );
    if (!updatedBlog) {
      return sendError(res, 'Blog not found', 404);
    }
    sendSuccess(res, updatedBlog, 'Blog updated successfully');
  } catch (error) {
    next(error);
  }
};

// Delete a Blog
const deleteBlog = async (req, res, next) => {
  const { id } = req.params;
  try {
    const result = await Blog.findByIdAndDelete(id);
    if (!result) {
      return sendError(res, 'Blog not found', 404);
    }
    sendSuccess(res, null, 'Blog deleted successfully');
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
};
