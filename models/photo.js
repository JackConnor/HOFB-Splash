var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var photoSchema = new Schema({
  photoUrl: String
  ,author: String
  ,title: String
  ,project: String
  ,timestamp: Date
})

module.exports = mongoose.model('Photo', photoSchema)
