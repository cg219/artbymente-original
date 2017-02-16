const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const config = require('./config');
const app = require('express')();
const bodyParser = require('body-parser');
const gqlHTTP = require('express-graphql');
const Schema = require('./schemas');
const {User, Image, Art} = require('./models');
const env = process.NODE_ENV || 'development';

const resolvers = {
  getUser: User.get.bind(User),
  createUser: User.make.bind(User)
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