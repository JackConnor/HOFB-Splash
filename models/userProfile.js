var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userProfileSchema = new Schema({
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
})

module.exports = mongoose.model('userProfile', userProfileSchema)
