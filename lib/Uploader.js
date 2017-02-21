const AWS = require('aws-sdk');
const s3 = require('s3');
const config = require('./../config');
const Image = require('./models/Image');
const awsClient = new AWS.S3({
  accessKeyId: config.s3.id,
  secretAccessKey: config.s3.secret,
  region: config.s3.region
})

class Uploader {
  static upload({input}) {
    return new Promise((resolve, reject) => {
      let { file, name} = input;
      let params = {
        localFile: file,
        s3Params: {
          Bucket: config.s3.bucket,
          Key: name
        }
      }
      let client = s3.createClient({
        s3Client: awsClient
      })
      let uploader = client.uploadFile(params);

      uploader.on('error', (err) => {
        console.error(err)
      })
      uploader.on('progress', () => {
        console.log('progress', uploader.progressMd5Amount, uploader.progressAmount, uploader.progressTotal);
      })
      uploader.on('end', () => {
        let url = s3.getPublicUrlHttp(config.s3.bucket, name);

        console.log('Finished Uploading');
        Image.make(url)
          .then(image => {
            console.log(image);
            resolve(image);
          })
          .catch(err => {
            if (err.code === 11000) {
              resolve(Image.findOne({url}));
            } else {
              console.error(err);
              reject(err);
            }
          })
      })
    })
  }
}

module.exports = Uploader;