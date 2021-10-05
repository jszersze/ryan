/**
 * Ryan's personal information.
 */
const mongoose = require('mongoose');
const type_schema = mongoose.Schema.Types;

const schema = new mongoose.Schema({
  word: String,
  tags: [String],
  definition: String, // Internal definition of the item.
  value: String, // Internal value when there is a preference.
  sense: String, // Sense to check against for value.
  emoji: String,
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now }
});

const model = mongoose.model('personal', schema);

module.exports = model;