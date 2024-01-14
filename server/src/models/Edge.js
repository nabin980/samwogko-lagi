// models/Edge.js
const mongoose = require('mongoose');

const edgeSchema = new mongoose.Schema({
  start: String,
  end: String,
  weight: Number,
});

module.exports = mongoose.model('Edge', edgeSchema);
