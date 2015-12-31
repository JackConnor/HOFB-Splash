var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var purchaseSchema = new Schema({
  purchaserId: String
  ,productId: String
  ,productCreatorId: String
  ,totalItems: Number
  ,totalItemsDivided: Array
  ,date: Date
  ,location: String
})

module.exports = mongoose.model('Purchase', purchaseSchema);
