const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  caption: String,
  photo: String,
});

module.exports = mongoose.model('Photo', photoSchema);
