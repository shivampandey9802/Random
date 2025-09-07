// models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: { type: String, default: "Admin" },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
