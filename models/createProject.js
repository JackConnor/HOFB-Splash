var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var createProjectSchema = new Schema({
  projectName: String
  ,projectType: String
})

module.exports = mongoose.model('Project', createProjectSchema)
