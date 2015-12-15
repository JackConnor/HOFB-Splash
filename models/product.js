var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: String
  ,timestamp: Date
  ,images: Array
  ,groups: Array
  ,description: String
  ,productType: String
  ,tags: Array
  ,vendor: String
  ,colors: Array
  ,fabrics: Array
  ,buttons: Array
  ,stitchPatterns: Array
  ,status: String
  ,season: String
  ,tier: String
})

module.exports = mongoose.model('product', productSchema)
