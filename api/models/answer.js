const mongoose = require('mongoose');
const type_schema = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  word: String,
  tags: [String],
  definition: String,
  value: String,
  sense: String,
  emoji: String,
  source: String,
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

const model = mongoose.model('answer', schema);

module.exports = model;