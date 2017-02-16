const mongoose = require('mongoose');
const Image = mongoose.Schema({
  url: String
})

module.exports = mongoose.model('Image', Image);