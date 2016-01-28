var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  email: String
  ,firstname: String
  ,lastname: String
  ,username: String
  ,passwordDigest: String
  ,status: String
  ,location: Object  //////this will hold all address, street, city, zip, etc
  ,products: Array
  ,favorites: Array
  ,signins: Number
  ,bio: String
  ,photos: Array
  ,bioPhoto: Array
  ,samplesRequested: Array //////this is a list of current samples requests that the user needs to respond to
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.passwordDigest)
}

module.exports = mongoose.model('User', userSchema)
