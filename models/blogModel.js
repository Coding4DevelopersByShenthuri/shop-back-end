const mongoose = require('mongoose');

const BlogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  tags: [{   
    type: String,
  }],
}, {
  timestamps: true, 
});

const Blog = mongoose.model('Blog', BlogSchema);
module.exports = Blog;
