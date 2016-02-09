var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: String
  ,userId: String
  ,curatorId: String
  ,timestamp: String
  ,images: Array
  ,thumbnails: Array
  ,collections: Array
  ,description: String
  ,comments: [{type: Schema.Types.ObjectId, ref: "productComment"}]
  ,productType: String
  ,tags: Array
  ,vendor: String
  ,fabrics: Array
  ,buttons: Array
  ,stitchPatterns: Array
  ,status: String
  ,season: String
  ,accessories: Array
  ,tier: Number
})

module.exports = mongoose.model('Product', productSchema)
