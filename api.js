var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var route          = express.Router();

//////bring in models////////
/////////////////////////////
// var Blogpost = require('./models/blogpost.js');
///////finish bringing models////
/////////////////////////////////

module.exports = function(app){

  // app.get('/api/articles', function(req, res){
  //   Blogpost.find({}, function(err, blogposts){
  //     if(err){console.log(err)}
  //     else{
  //       res.json(blogposts)
  //     }
  //   });
  // });
  //
  // app.get('/api/articles/:id', function(req, res){
  //   console.log(req.params.id);
  //   Blogpost.findOne({"_id": req.params.id}, function(err, article){
  //     if(err){console.log(err)}
  //     else{
  //       console.log(article);
  //       res.json(article);
  //     }
  //   })
  // })
}


// mongoose.connect('mongodb://jackconnor:Skateboard1@ds059654.mongolab.com:59654/vqblog')
