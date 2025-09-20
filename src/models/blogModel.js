const mongoose = require("mongoose");
const BlogSchema = new mongoose.Schema({
  blog_title: {
    type: String,
    required: true,
  },
  blog_image: {
    type: String,
    required: false,
  },
  blog_description: {
    type: String,
    required: true,
  },
  blog_read_time: {
    type: String,
    required: true,
  },
  blog_date: {
    type: Date,
    required: false,
  },
  blog_category: {
    type: String,
    required: false,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  author: {
    type: String,
    default: "Admin",
  },
});
const Blogs = new mongoose.model("blog", BlogSchema);
module.exports = Blogs;
