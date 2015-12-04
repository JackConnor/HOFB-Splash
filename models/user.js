var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  email: String
  ,password: String
  ,location: String
  ,firstName: String
  ,address: String
  ,city: String
  ,profession: String
  ,submittedProducts: Array
  ,acceptedProducts: Array
})

module.exports = mongoose.model('User', userSchema)
