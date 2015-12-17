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
var cloudinary     = require('cloudinary');
console.log(cloudinary.api.ping());

cloudinary.config({
  cloud_name: 'hofb'
  ,api_key: process.env.CLOUDINARY_API_KEY
  ,api_secret: process.env.CLOUDINARY_SECRET
})

console.log(cloudinary.config());
//

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
  app.post('/api/projects', function(req, res){
    Product.create(req.body, function(err, product){
      if(err) throw err;
      res.json(product);
    })
  })

  /////update a product
  app.post('/api/project/update', function(req, res){
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
  ///get all product comments
  app.get('/api/view/product', function(req, res){
    console.log('productComment')
    productComment.find({}, function(err, productComment){
      if(err) console.log(err)
      console.log(productComment); //this is a console log that will pop up through the terminal shell
      res.json(productComment)
    })
  })

  ///get a single product comments
  // app.get('/api/view/product/:id', function(req, res){
  //   Product.findOne({"_id":req.params.id}, function(err, productComments){
  //     if(err) throw err;
  //     res.json(productComments);
  //   })
  // })

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
  			res.redirect( '/login')
  		} else {
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
    jwt.sign({iss: "hofb.com", name: req.body.email}, process.env.JWT_TOKEN_SECRET, {expiresIn: "4h", audience: "designer"}, function(token){
      res.json(token);
    });
  })

  ///////check the users status from the jwt web token (as "audience")/////
  app.get('/api/checkstatus/:jwt', function(req, res){
    var token = req.params.jwt;
    console.log(req.params);
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, function(err, decodedToken){
      if(err){console.log(err)}
      console.log(decodedToken);
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

  app.post('/api/pictures/upload', multer({ dest: './uploads/'}).single('upl'), function(req,res){
  	// console.log(req.body); //form fields
  	/* example output:
  	{ title: 'abc' }
  	 */

   console.log('yoyo');
   console.log(req.file); //form files
   req.file.fieldname = req.file.originalname
   req.body.fieldname = req.body.originalname
   console.log(req);

   cloudinary.uploader.upload('./uploads/'+req.file.filename, function(uploadResult){
     console.log(uploadResult);
   })
  //  var thisPhoto = require("./uploads/"+req.body.originalname)
  //  console.log(thisPhoto);
  //  req.file.encoding = '64bit';
  //  Photo.create({
  //    photoData: thisPhoto
  //    ,author: "jack connor"
  //    ,title: "first test photo, baby"
  //  }, function(err, newPhoto){
  //    console.log(newPhoto);
  //  })

  	/* example output:
              { fieldname: 'upl',
                originalname: 'grumpy.png',
                encoding: '7bit',
                mimetype: 'image/png',
                destination: './uploads/',
                filename: '436ec561793aa4dc475a88e84776b1b9',
                path: 'uploads/436ec561793aa4dc475a88e84776b1b9',
                size: 277056 }

  	 */
  	res.status(204).end();
  });


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
  /////end email stuff////////////////////
  ////////////////////////////////////////
  
}

//mongoose.connect('mongodb://chris:password@ds063134.mongolab.com:63134/hofbsplash')
//mongoose.connect('mongodb://localhost:27017/myproject');

var db = process.env.DB_URL_HOFB;
//mongoose.connect(db)
mongoose.connect('mongodb://jackconnor:Skateboard1@ds063134.mongolab.com:63134/hofbsplash')
//mongoose.connect(ENV['DB_URL'])
