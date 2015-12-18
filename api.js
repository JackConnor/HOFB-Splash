var express        = require('express');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var jwt            = require('jsonwebtoken');
var cities         = require('cities');
var mandrill = require('mandrill-api/mandrill');
var mandrill_client= new mandrill.Mandrill(process.env.MANDRILL_KEY);
var route          = express.Router();
var bcrypt         = require('bcrypt-nodejs');
var passport       = require('passport');
var passportLocal  = require('passport-local');
var multer         = require('multer');
var upload         = multer({ dest: './uploads/'});
var cloudinary     = require('cloudinary');

cloudinary.config({
  cloud_name: 'hofb'
  ,api_key: process.env.CLOUDINARY_API_KEY
  ,api_secret: process.env.CLOUDINARY_SECRET
})

//===========================================================

//////bring in models////////
/////////////////////////////
var Emailcapture = require('./models/emailCapture.js');
var User         = require('./models/user.js');
var Product      = require('./models/product.js');
var Project      = require('./models/createProject.js');
var viewProduct      = require('./models/viewProduct.js');
var Photo      = require('./models/photo.js');
var productComment      = require('./models/productComment.js');
///////finish bringing models////
/////////////////////////////////

module.exports = function(app){

  /////////////////////////////////
  ////////begin user api requests////



  //get all createProjects
  app.get('/api/createprojects', function(req, res){
    console.log('creating')
    Project.find({}, function(err, projects){
      if(err) console.log(err)
      // console.log(projects)
      res.json(projects)
    })
    res.json(projects)
  })


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
      res.json(user);
    })
  })

  /////update a user
  app.post('/api/users/update', function(req, res){
    User.findOne({"_id":req.body.id}, function(err, user){
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
///get a single product by ID
  app.get('/api/product/:id', function(req, res){
    Product.findOne({"_id":req.params.id}, function(err, product){
      if(err) throw err;
      res.json(product);
    })
  })

  app.get('/defaultsite', function(req, res){
    res.redirect('/#/')
  })

  ///////get all products
  app.get('/api/projects', function(req, res){
    Product.find({}, function(err, products){
      if(err) throw err;
      res.json(products)
    })
  })

  ///get a single product
  app.get('/api/projects/:id', function(req, res){
    Product.findOne({"_id":req.params.id}, function(err, product){
      if(err) throw err;
      res.json(product);
    })
  })

  ////post a single product
  app.post('/api/products', function(req, res){
    console.log(req.body);
    Product.create(req.body, function(err, product){
      if(err) throw err;
      console.log(product);
      res.json(product);
    })
  })

  /////update a product
  app.post('/api/product/update', function(req, res){
    console.log(req.body);
    console.log(req.body.projectId);
    Product.findOne({"_id":req.body.projectId}, function(err, product){
      if(err){console.log(err)}
        product.name = req.body.name;
        product.productType = req.body.productType;
        product.vendor = req.body.vendor;
        product.stitchPattern = req.body.stitchPattern;
        product.description = req.body.description;
        product.collections = req.body.collections;
        product.tags = req.body.tags;
        product.colors = req.body.colors;
        product.fabrics = req.body.fabrics;
        product.seasons = req.body.seasons;
        product.buttons = req.body.button;
        product.save(function(err, product){
        res.json(product)
      });
    })
  })


  //////delete a product
  app.delete('/api/product/:product_id', function(req, res){
    Product.remove({"_id": req.params.product_id}, function(err, removedProduct){
      if(err){console.log(err)}
      res.json(removedProduct);
    })
  })

  /////get all products from one user
  app.get('/api/:user/products', function(req, res){
    var userId = req.params.user;
    Product.find({'userId':userId}, function(err, products){
      res.json(products);
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

  //////////////////////////////////////
  ///////Signup, Login, Authorization, and Sessions
  app.post('/api/signup', function( req, res ) {
  	User.findOne( { email: req.body.email }, function(err, user){
  		if (err ) {
  				res.json( err )
  		} else if ( user ) {
  			res.redirect( '/')
  		} else {
        //////situation where no user is found (aka email is unique)
  			var newUser = new User();
  			newUser.email = req.body.email
  			newUser.passwordDigest = newUser.generateHash( req.body.password )
  			newUser.save( function( err, user ) {
  				if ( err ) { console.log(err) }
  				//AUTHENTICATE USER HERE
  				res.json(user)
  			})
  		}
  	})

  } )

  //////session and token stuff
  ///////begin the session
  app.post('/api/startsession', function(req, res){
    var password = req.body.password;
    User.findOne({'email': req.body.email}, function(err, user){
      if(err){console.log(err)}
      if (user.validPassword(password)) {
        //////user password verified
        jwt.sign({iss: "hofb.com", name: user._id}, process.env.JWT_TOKEN_SECRET, {
          expiresIn: "24h"
          ,audience: "designer"}
          ,function(token){
            res.json(token);
          });
        }
    })
  })

  ///////check the users status from the jwt web token (as "audience")/////
  app.get('/api/checkstatus/:jwt', function(req, res){
    var token = req.params.jwt;
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, function(err, decodedToken){
      if(err){console.log(err)}
      ////////this returns either the string "designer", "buyer", "admin", or "superAdmin"
      res.json(decodedToken);
    });
  })

  ///////End Signup, Login, Authorization, and Sessions
  ///////////////////////////////////////////////////////

  ///////////////////////////////////////
  /////Begin photo uploading logic///////
  var uploading = multer({
    dest: __dirname + '../public/uploads/',
  })

  // app.post('/api/photo', function(req, res, err){
  //   console.log(req.body);
  //   console.log(req.body.file);
  //   res.json({message:'at least we got some back-and-forth'})
  //   cloudinary.uploader.upload(req.file, function(uploadResult){
  //      console.log(uploadResult);
  //      res.json(uploadResult.secure_url)
  //    })
  // })

  app.post('/api/pictures', upload.array('files', 4), function(req,res){
    // console.log(req.body);
    // console.log(req.files);
    for (var i = 0; i < req.files.length; i++) {
      var fileName = req.files[i].filename;
      var destination = req.files[i].destination
      cloudinary.uploader.upload(destination+fileName, function(uploadResult){
        var id = req.body.productId;
        Product.findOne({"_id": id}, function(err, product){
          if(err){console.log(err)}
          product.images.push(uploadResult.secure_url);
          product.save({}, function(){
          });
        })
      })
    }
    res.redirect('/#/designer/dashboard');
  });

  app.get('/api/photos', function(req, res){
    Photo.find({}, function(err, photos){
      if(err){console.log(err)}
      res.json(photos)
    })
  })
  /////End photo uploading logic/////////
  ///////////////////////////////////////


  //////////////////////////////////////////
  /////begin email stuff////////////////////
  app.post('/api/sendemail', function(req, res){
    mandrill_client.messages.send({
      message: {
        from_email: "thankyou@hofb.com"
        ,html:
        "<divs>"+
          "<img src='http://i.imgur.com/f5T6U5B.png' style='width:250px'>"+
          "<h2 style='color:#737373'>Thank you for joining HOFB. We’re gearing up to introduce you to our exciting new platform, created solely for the purpose of making your work and life easier! In the coming days and weeks, you will receive a link via e-mail which will invite you to enter and start using the closed beta HOFB platform. "+
          "<br>"+
          "Please bear with us while we onboard users gradually.</h2>"+
          "<h2 style='color:#293d3d'>HOFB</h2>"+
          "<h3 style='color:#293d3d'>Los Angeles</h3>"+
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

  /////get all emails from splash collection to email back to us
  app.get('/api/emails', function(req, res){
    console.log('in emails');
    Emailcapture.find({}, function(err, emails){
      console.log(emails);
      var allEmails = [];
      for (var i = 0; i < 35; i++) {
        var passBool = true;
        for (var j = 0; j < allEmails.length; j++) {
          if(emails[i] == allEmails[j]){
            console.log('a double');
            passBool = false;
          }
        }
        if(passBool){
          allEmails.push(emails[i].email)
        }
      }
      var uniqueArray = allEmails;
      // var uniqueArray = [];
      // for (var i = 0; i < emails.length; i++) {
      //   for (var j = 0; j < uniqueArray.length; j++) {
      //     if(emails[i].email == uniqueArray[j]){
      //     }
      //     else{
      //     }
      //   }
      //   uniqueArray.push(emails[i].email);
      // }
      // console.log(uniqueArray);
      var emailStringFunc = function(){
        var eString = "";
        for (var i = 0; i < uniqueArray.length; i++) {
          eString = eString+" "+uniqueArray[i]+",";
        }
        return eString;
      }
      var emailString = emailStringFunc();
      console.log(emailString);
      //
      mandrill_client.messages.send({
        message: {
          from_email: "jack@jack.com"
          ,html: "<h2>"+emailString+"</h2>"
          ,subject: "Email Signups"
          ,to:[{
            email: "jackc@hofb.com"
          }]
        }
      })
      //
    });
  });
  /////end email stuff////////////////////
  ////////////////////////////////////////

  ////Start of commenting system///////
  ////////////////////////////////////

  ///get all product comments
  app.get('/api/view/product', function(req, res){
    console.log('productComment')
    productComment.find({}, function(err, productComments){
      if(err) console.log(err)
      console.log(productComments); //this is a console log that will pop up through the terminal shell
      res.json(productComments)
    })
  })

  /////get all comments sent to a specific user
  app.get('/api/view/comments/:receiverId', function(req, res){
    console.log(req.params);
    productComment.find({"receiver": "56719a11ee024833030efede"}, function(err, comments){
      console.log(comments);
      res.json(comments)
    })
  })


  ///Posting a single comment
  app.post("/api/product/comment", function(req, res){
    console.log(req.body);
    productComment.create(req.body, function(err, productComment){
      if(err) throw err;
      res.json(productComment);
    })
  })



}

/////End of commenting system ////////
/////////////////////////////////////
/////////////////////////////////////

//mongoose.connect('mongodb://chris:password@ds063134.mongolab.com:63134/hofbsplash')
//mongoose.connect('mongodb://localhost:27017/myproject');

var db = process.env.DB_URL_HOFB;
//mongoose.connect(db)
mongoose.connect(db)
//mongoose.connect(ENV['DB_URL'])
