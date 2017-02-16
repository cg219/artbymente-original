const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  }
})

User.statics.hashPassword = function hashPassword(password) {
  return bcrypt.hash(password, 8);
}

User.statics.checkPassword = function checkPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

User.statics.make = function createUser(userInput) {
  const {username, password} = userInput.input;

  return new Promise((resolve, reject) => {
    User.statics.hashPassword(password)
      .then(hashedPassword => {
        const user = {
          username: username,
          password: hashedPassword
        };

        return this.create(user);
      })
      .then(savedUser => {
        const response = {
          user: savedUser,
          error: null
        }

        console.log(response);
        resolve(response);
      })
      .catch(err => {
        const messages = {
          11000: 'User Already Exists'
        }
        const error = {
          user: null,
          error: {
            code: `${err.code}`,
            message: `${messages[err.code]}`
          }
        }

        console.error(err);
        console.error(error);
        resolve(error);
      })
  })
}

User.statics.get = function getUser(userInput) {
  const {username} = userInput.input;

  return new Promise((resolve, reject) => {
    this.findOne({username: username}, (err, results) => {
      if(err){
        reject(err);
      }

      resolve(results);
    })
  })
}

module.exports = mongoose.model('User', User);