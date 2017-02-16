const mongoose = require('mongoose');
const Image = require('./Image');
const Art = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  listingId: String,
  description: String,
  created: {
    type: Date,
    required: true
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  thumbnail: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Image'
  },
  images: {
    type: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image'
    }]
  },
  purchasable: {
    type: Boolean,
    default: false
  }
})

module.exports = mongoose.model('Art', Art);