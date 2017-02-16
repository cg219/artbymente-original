const {User} = require('./../models');

class MenteResolver {
  createUser(input) {
    
  }

  getUser(input) {
    const {username} = input.input;

    return new Promise((resolve, reject) => {
      User.findOne({username: username}, (err, results) => {
        if(err){
          reject(err);
        }

        resolve(results);
      })
    })
  }
}

module.exports = MenteResolver;