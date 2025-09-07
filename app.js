// app.js
const express = require("express");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("./models/User");
const cookieParser = require('cookie-parser');
require('dotenv').config();

const app = express();

app.use(cookieParser());
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

app.get('/logout', (req, res) => {
  res.cookie('token', '', { expires: new Date(0) })
  res.redirect('/login')
})

app.get('/register', (req, res) => {
  res.render('register');
})

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body
  if(!username || !email || !password) {
    return res.status(400).send('All fields are required')
  }

  const existingUser = await User.findOne({ email })

  if(existingUser) {
    res.render('login')
  }

  const hashedPassword = await bcrypt.hash(password, 10)
  const user = new User({ username, email, password: hashedPassword })
  await user.save()
  res.render('login')
})

app.get('/login', (req, res) => {
  res.render('login')
})

app.post('/login', async (req, res) => {
  const { email, password } = req.body
  if(!email || !password) {
    return res.status(400).send('All fields are required')
  }
  const user = await User.findOne({ email })
  if(!user) {
    return res.status(400).send('No user found')
  }
  const isMatch = await bcrypt.compare(password, user.password)
  if(!isMatch) {
    return res.status(400).send('Invalid credentials')
  }
  const token = jwt.sign({ id: user}, 'secretkey',{
    expiresIn: '1d'
  })
  res.cookie('token', token, { httpOnly: true })
  res.redirect('/')
})

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
