var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var conversationSchema = new Schema({
  productName: String
  ,adminOrBuyer: Boolean
  ,dateCreated: Date
  ,lastUpdated: Date
  ,comments: Array///will all comments in chronological order
  ,ownerId: String////product owner's id
  ,adminOrBuyerId: String////Id of th person a user is talking to
})

module.exports = mongoose.model("Conversation", conversationSchema);
