var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  email: String
  ,passwordDigest: String
  ,status: String
  ,token: String
  ,location: String
  ,firstname: String
  ,lastname: String
  ,address: String
  ,city: String
  ,profession: String
  ,submittedProducts: Array
  ,acceptedProducts: Array
  ,products: Array
  ,favorites: Array
  ,signins: Number
  ,bio: String
  ,username: String
  ,photo: String
  ,samplesRequested: Array
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordDigest)
}

module.exports = mongoose.model('User', userSchema)
