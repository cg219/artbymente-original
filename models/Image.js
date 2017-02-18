const mongoose = require('mongoose');
const Image = mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true
  }
})

Image.statics.make = function makeImage({url}) {
  return new Promise((resolve, reject) => {
    this.create({url})
      .then(result => {
        resolve(result);
      })
      .catch(err => {
        console.error(err);
        reject(err);
      })
  })
}

module.exports = mongoose.model('Image', Image);