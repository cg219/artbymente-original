const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('./config');
const app = require('express')();
const bodyParser = require('body-parser');
const gqlHTTP = require('express-graphql');
const Schema = require('./lib/schemas');
const {User, Image, Art} = require('./lib/models');
const env = process.NODE_ENV || 'development';
const Uploader = require('./lib/Uploader');

const resolvers = {
  getUser: User.get.bind(User),
  createUser: User.make.bind(User),
  createArt: Art.make.bind(Art),
  updateArt: Art.update.bind(Art),
  createImage: Image.make.bind(Image),
  uploadImage: Uploader.upload
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.raw());
app.use('/api', gqlHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true,
  rootValue: resolvers
}));
mongoose.connect(config.mongo[env]);

app.listen(4000, () => {
  console.log('Starting')
})