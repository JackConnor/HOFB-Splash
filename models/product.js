var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: String
  ,userId: String
  ,curatorId: String
  ,purchaserInformation: Array
  ,timestamp: Date
  ,images: Array
  ,thumbnails: Array
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
  ,tier: Number
})

module.exports = mongoose.model('product', productSchema)
