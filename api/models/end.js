const mongoose = require('mongoose');
const type_schema = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  mood: Number, // 1 is happy - 5 is angry
  text: String,
  emoji: String,
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

const model = mongoose.model('end', schema);

module.exports = model;