var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var userSchema = new Schema({
  email: String
  ,passwordDigest: String
  ,location: String
  ,firstname: String
  ,lastname: String
  ,address: String
  ,city: String
  ,profession: String
  ,submittedProducts: Array
  ,acceptedProducts: Array
})

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  console.log(password);
  console.log(this.password);
	console.log(bcrypt.compareSync(password, this.password));
  return bcrypt.compareSync(password, this.password)
}

module.exports = mongoose.model('User', userSchema)
