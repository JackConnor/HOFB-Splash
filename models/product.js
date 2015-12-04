var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: String
  ,timestamp: Date
  ,images: Array
  ,groups: Array
  ,productType: String
  ,tags: Array
  ,vendor: String
  ,colors: Array
  ,Fabrics: Array
  ,buttons: Array
  ,stitchPattern: String
})

module.exports = mongoose.model('product', productSchema)
