// models/Node.js
const mongoose = require('mongoose');

const nodeSchema = new mongoose.Schema({
  id: String,
  lat: Number,
  lng: Number,
});

module.exports = mongoose.model('Node', nodeSchema);
