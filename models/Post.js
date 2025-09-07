const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  content: String,
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Post", postSchema);
