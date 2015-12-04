var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cities         = require('cities');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill('peYat9DNVGXpYcy2o6bypw');
var route          = express.Router();

console.log(mandrill_client);

//////bring in models////////
/////////////////////////////
var Emailcapture = require('./models/emailCapture.js');
var User = require('./models/user.js');
///////finish bringing models////
/////////////////////////////////

module.exports = function(app){

  ////get and list all emails
  app.get('/api/emailcaptures', function(req, res){
    Emailcapture.find({}, function(err, emails){
      if(err){console.log(err)}
      else{
        console.log(emails);
        res.json(emails)
      }
    });
  });

  //get and list one email
  app.get('/api/emailcaptures/:id', function(req, res){
    Emailcapture.findOne({"_id": req.params.id}, function(err, email){
      if(err){console.log(err)}
      else{
        res.json(email);
      }
    });
  });

  app.post('/api/emailcaptures', function(req, res){
    console.log(req.body.email);
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

  /////email stuff
  app.post('/api/sendemail', function(req, res){
    console.log(req.body.email);
    mandrill_client.messages.send({
      message: {
        from_email: "thankyou@hofb.com"
        ,text: "Thank you for signing up with HOFB!"
        ,subject: "HOFB Signup Confirmation"
        ,to:[{
          email: req.body.email
        }]
      }
    }, function(data){
      res.json(data)
    })
  })
}
mongoose.connect('mongodb://jackconnor:Skateboard1@ds063134.mongolab.com:63134/hofbsplash')
