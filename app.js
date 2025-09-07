// app.js
const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/Post");
require('dotenv').config();

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

// Connect MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// Home Route
app.get("/", async (req, res) => {
  const posts = await Post.find().sort({ date: -1 });
  res.render("index", { posts });
});

// Compose Route (Form Page)
app.get("/compose", (req, res) => {
  res.render("compose");
});

// Handle Post Request
app.post("/compose", async (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content
  });
  await newPost.save();
  res.redirect("/");
});

// Start Server
app.listen(3000, () => {
  console.log("🚀 Server started on http://localhost:3000");
});
