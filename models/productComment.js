var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productCommentSchema = new Schema({
  sender: String
  ,date: Date
  ,commentText: String
})

module.exports = mongoose.model('productComment', productCommentSchema)
