var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cities         = require('cities');
var route          = express.Router();

//////bring in models////////
/////////////////////////////
var Emailcapture = require('./models/emailCapture.js');
///////finish bringing models////
/////////////////////////////////

module.exports = function(app){

  app.get('/api/emailcaptures', function(req, res){
    Emailcapture.find({}, function(err, emails){
      if(err){console.log(err)}
      else{
        console.log(emails);
        res.json(emails)
      }
    });
  });

  app.post('/api/emailcaptures', function(req, res){
    console.log(req.body);
    Emailcapture.create(req.body, function(err, emailCapture){
      if(err){console.log(err)}
      else(
        res.json(emailCapture)
      )
    })
  })

  app.post('/api/cities', function(req, res){
    var cityData = cities.gps_lookup(req.body.long, req.body.lat);
    res.json(cityData.zipcode)
  })

}


mongoose.connect('mongodb://jackconnor:Skateboard1@ds063134.mongolab.com:63134/hofbsplash')
