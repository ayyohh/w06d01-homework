const mongoose = require('mongoose');
const Photo = require('./photos');

const userSchema = new mongoose.Schema({
  username: {type: String, required: true},
  password: {type: String, required: true},
  photos: [Photo.schema]
});

module.exports = mongoose.model('User', userSchema);
