var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: String
  ,userId: String
  ,curatorId: String
  ,timestamp: Date
  ,images: Array
  ,collections: Array
  ,description: String
  ,productType: String
  ,tags: Array
  ,vendor: String
  ,colors: Array
  ,fabrics: Array
  ,buttons: Array
  ,stitchPatterns: Array
  ,status: String
  ,seasons: Array
  ,tier: String
})

module.exports = mongoose.model('product', productSchema)
