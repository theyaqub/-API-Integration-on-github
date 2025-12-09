const mongoose = require('mongoose');

const repositorySchema = new mongoose.Schema({
  username: { type: String, required: true, index: true },
  name: { type: String, required: true },
  full_name: { type: String, required: true, unique: true },
  description: String,
  language: String,
  stars: Number,
  forks: Number,
  open_issues: Number,
  is_fork: Boolean,
  html_url: String,
  created_at: Date,
  updated_at: Date,
  cached_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repository', repositorySchema);
