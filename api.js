var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var cities         = require('cities');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client = new mandrill.Mandrill(process.env.MANDRILL_KEY);
var route          = express.Router();

//////bring in models////////
/////////////////////////////
var Emailcapture = require('./models/emailCapture.js');
var User         = require('./models/user.js');
var Product      = require('./models/product.js');
///////finish bringing models////
/////////////////////////////////

module.exports = function(app){

  /////////////////////////////////
  ////////begin user api requests////

  //get all users
  app.get('/api/users', function(req, res){
    User.find({}, function(err, users){
      if(err) throw err;
      res.json(users)
    })
  })

  //get a single user
  app.get("/api/users/:id", function(req, res){
    User.findOne({"_id":req.params.id}, function(err, user){
      if(err) throw err;
      res.json(user);
    })
  })

  ///create a new user
  app.post('/api/users', function(req, res){
    User.create(req.body, function(err, user){
      if(err){console.log(err)}
      ////json with info of new user we created
      res.json(user)
    })
  })

  /////update a user
  app.post('/api/users/update', function(req, res){
    User.findOne(req.body.id, function(err, user){
      if(err){console.log(err)}
      if(req.body.email){
        user.email = req.body.email
      }
      if(req.body.password){
        user.email = req.body.password
      }
      if(req.body.location){
        user.email = req.body.location
      }
      if(req.body.firstname){
        user.email = req.body.firstname
      }
      if(req.body.lastname){
        user.email = req.body.lastname
      }
      if(req.body.address){
        user.email = req.body.address
      }
      if(req.body.city){
        user.email = req.body.city
      }
      if(req.body.profession){
        user.email = req.body.profession
      }
      user.save(function(err, user){
        res.json(user)
      });
    })
  })
  ////////end user api requests////
  /////////////////////////////////

  /////////////////////////////////
  ////////Begin Product API calls//

  ///////get all products
  app.get('/api/products', function(req, res){
    Product.find({}, function(err, products){
      if(err) throw err;
      res.json(products)
    })
  })

  ///get a single product
  app.get('/api/products/:id', function(req, res){
    Product.findOne({"_id":req.params.id}, function(err, product){
      if(err) throw err;
      res.json(product);
    })
  })

  ////post a single product
  app.post('/api/products', function(req, res){
    Product.create(req.body, function(err, product){
      if(err) throw err;
      res.json(product);
    })
  })

  /////update a product
  app.post('/api/product/update', function(req, res){
    Product.findOne(req.body.id, function(err, product){
      if(err){console.log(err)}

      if(req.body.name){
        product.name = req.body.name
      }
      if(req.body.timestamp){
        product.email = req.body.timestamp
      }
      if(req.body.productType){
        product.email = req.body.productType
      }
      if(req.body.vendor){
        product.email = req.body.vendor
      }
      if(req.body.stitchPattern){
        product.email = req.body.stitchPattern
      }

      product.save(function(err, product){
        res.json(product)
      });
    })
  })

  ////////End Product API calls////
  /////////////////////////////////

  //////////////////////////////////
  //////Begin Emailcapture calls////

  ////get and list all emails
  app.get('/api/emailcaptures', function(req, res){
    Emailcapture.find({}, function(err, emails){
      if(err){console.log(err)}
      else{
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
    mandrill_client.messages.send({
      message: {
        from_email: "thankyou@hofb.com"
        ,html:
        "<divs style='background-color:#E0F8EC'>"+
          "<h2>Be the first to gain access to HOFB, a FREE new platform allowing the design styles of independent and emerging fashion designers to be discovered by buyers and mass retailers globally."+
          "HOFB ends the struggles faced by independent and emerging fashion designers who have to cold-call and send line sheets and style guides to countless retailers just hoping for a favorable response. Likewise, buyers and mass retailers no longer have to waste time searching through endless line sheets and products that do not fit the retailer’s merchandising plan. HOFB is a seamless platform for both fashion designers and buyers to capitalize on each other’s work, and it’s FREE!</h2>"+
        "</div>"
        ,subject: "HOFB Signup Confirmation"
        ,to:[{
          email: req.body.email
        }]
      }
    }, function(data){
      res.json(data)
    })
  })
  //////End Emailcapture calls//////
  //////////////////////////////////
}

var db = process.env.DB_URL_HOFB;
mongoose.connect(db)
// mongoose.connect('mongodb://jackconnor:Skateboard1@ds063134.mongolab.com:63134/hofbsplash')
// mongoose.connect(ENV['DB_URL'])
