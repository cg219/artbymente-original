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
    type: String,
    ref: 'Image'
  },
  images: {
    type: [{
      type: String,
      ref: 'Image'
    }]
  },
  purchasable: {
    type: Boolean,
    default: false
  }
})

Art.statics.make = function createArt({input}) {
  const { title, description, listingId, slug, canBuy, created, thumbnail, images } = input;

  return new Promise((resolve, reject) => {
    let promises = [];
    const art = {
      title,
      description,
      listingId,
      slug,
      purchasable: canBuy,
      created
    }

    if (thumbnail) {
      promises.push(Image.findOne({url: thumbnail}));
    }

    Promise.all(promises)
      .then(results => {
        let foundThumbnail = results[0];
        let promises = [];

        if (foundThumbnail) {
          art.thumbnail = foundThumbnail.url
        }

        if (images) {
          promises = images.map(url => Image.findOne({ url }))
        }

        return Promise.all(promises);
      })
      .then(results => {
        let foundImages = results;

        art.images = foundImages.filter(image => image != null);

        return this.create(art);
      })
      .then(savedArt => resolve(savedArt))
      .catch(err => {
        console.error(err);
        reject(err);
      })
  })
}

Art.statics.update = function update({input}) {
  const { title, description, listingId, slug, canBuy, created, thumbnail, images, updatedSlug } = input;

  return new Promise((resolve, reject) => {
    let promises = [];

    this.findOne({slug}).exec()
      .then(art => {
        const updatedArt = {
          title,
          description,
          listingId,
          slug,
          purchasable: canBuy,
          created
        }

        if(art){
          Object.keys(updatedArt).forEach(key => {
            art[key] = updatedArt[key] !== undefined ? updatedArt[key] : art[key];
          })

          art.slug = updatedSlug ? updatedSlug : art.slug;
          promises.push(art);

          if (thumbnail) {
            if (thumbnail !== art.thumbnail) {
              promises.push(Image.findOne({url: thumbnail}));
            }
          }

          return Promise.all(promises);
        }

        reject({
          message: `Couldn't find Art Item`
        })
      })
      .then(results => {
        let art = results[0];
        let foundThumbnail = results[1];
        let promises = [];

        if (foundThumbnail) {
          art.thumbnail = foundThumbnail.url;
        }

        promises.push(art);

        if (images) {
          images.forEach(image => {
            promises.push(Image.findOne({url: image}));
          })
        }

        return Promise.all(promises);
      })
      .then(results => {
        let art = results.shift();
        let foundImages = results;
        let newImages = foundImages.map(image => {
          if (image) { return image.url; }
        })

        art.images = newImages;

        return art.save();
      })
      .then(art => {
        resolve(art);
      })
      .catch(err => {
        console.log(err);
        reject(err);
      })
  })
}

module.exports = mongoose.model('Art', Art);