var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var emailCaptureSchema = new Schema({
  email: String
  ,date: Date
  ,location: String
})

module.exports = mongoose.model('Emailcapture', emailCaptureSchema)
