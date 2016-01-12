var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sampleSchema = new Schema({
  requesterId: String
  ,productId: String
  ,sampleProducer: String
  ,status: String
})

module.exports = mongoose.model('Sample', sampleSchema);
