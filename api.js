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
var https = require('https');
var fs = require('fs');

cloudinary.config({
  cloud_name: 'hofb'
  ,api_key: process.env.CLOUDINARY_API_KEY
  ,api_secret: process.env.CLOUDINARY_SECRET
})

//===========================================================

//////bring in models////////
/////////////////////////////
var Emailcapture       = require('./models/emailCapture.js');
var User               = require('./models/user.js');
var Product            = require('./models/product.js');
var Photo              = require('./models/photo.js');
var productComment     = require('./models/productComment.js');
var Conversation       = require('./models/conversation.js');
var Purchase           = require('./models/purchase.js');
var Sample             = require('./models/sample.js');
console.log("david");
console.log('bowie');
///////finish bringing models////
/////////////////////////////////

module.exports = function(app){

  /////////////////////////////////
  ////////begin user api requests////


  //get all users
  app.get('/api/users', function(req, res){
    User.find({}, function(err, users){
      if(err) throw err;
      res.json(users);
    })
  })

  //get a single user
  app.get("/api/users/:id", function(req, res){
    console.log(req.params);
    User.findOne({"_id":req.params.id}, function(err, user){
      if(err) res.json('no id');
      res.json(user);
    })
  })

  //get a single user with all products populated
  app.get("/api/users/:id/products", function(req, res){
    console.log(req.params);
    User.findOne({"_id":req.params.id})
    .populate('products')
    // .populate('photos')
    .exec(function(err, user){
      if(err){console.log(err)}
      console.log(user.products[0]);
      console.log(user.products[1]);
      res.json(user);
    })
  })

  //get a single user profile
  app.get("/api/user/profile/:id", function(req, res){
    console.log(req.params);
    User.findOne({"_id":req.params.id}, function(err, User){
      if(err) throw err;
      res.json(User);
    })
  })


  ///create a new user
  app.post('/api/users', function(req, res){
    console.log(req.body);
    console.log('no doing the User stuff');
    var user = new User();
    user.passwordDigest = user.generateHash(req.body.password);
    user.email = req.body.email;
    console.log(user);
    user.status = req.body.status;
    user.firstname = req.body.firstname;
    user.lastname = req.body.lastname;
    user.save(function(err, user){
      console.log(user);
      res.json(user);
    })
  })

  app.post('/api/new/user', function(req, res){
    console.log(req.body);
    User.create(req.body, function(err, user){
      console.log(user);
      res.json(user);
    })
  })

  /////post call to update a user profile
  app.post('/api/users/update', function(req, res){
    console.log(req.body);
    User.findOne({"_id":req.body.userId}, function(err, user){
      if(err){console.log(err)}
      if(req.body.email){
        user.email = req.body.email
      }
      if(req.body.password){
        user.passwordDigest = user.generateHash( req.body.password );
      }
      if(req.body.location){
        user.location = req.body.location
      }
      if(req.body.favorite){
        user.favorites.push(req.body.favorite);
      }
      if(req.body.removeFavorite){
        for (var i = 0; i < user.favorites.length; i++) {
          if(user.favorites[i] == req.body.removeFavorite){
            user.favorites.splice(i, 1);
          }
        }
      }
      if(req.body.firstname){
        user.firstname = req.body.firstname;
      }
      if(req.body.lastname){
        user.lastname = req.body.lastname;
      }
      if(req.body.address){
        user.address = req.body.address;
      }
      if(req.body.city){
        user.city = req.body.city;
      }
      if(req.body.profession){
        user.profession = req.body.profession;
      }
      if(req.body.productId){
        console.log(user.products);
        console.log(req.body.productId);
        user.products.push(req.body.productId);
        console.log(user.products);
      }
      if(req.body.status){
        user.status = req.body.status;
      }
      if(req.body.samplesRequested){
        user.samplesRequested.push(req.body.samplesRequested);
      }
      if(req.body.username){
        user.username = req.body.username
      }
      if(req.body.bio){
        user.bio = req.body.bio
      }
      if(req.body.bioPhoto){
        user.bioPhoto[0] = req.body.bioPhoto
      }
      user.save(function(err, user){
        if(err){console.log(err)}
        console.log(user);
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
      if(err) console.log(err);
      else{
        res.json(product);
      }
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

  ///get all products currently being submitted for curation
  app.get('/api/submitted/products', function(req, res){
    Product.find({"status": "submitted to curator"}, function(err, productsToCurate){
      var allProds = [];
      var submittedProds = productsToCurate;
      for (var i = 0; i < submittedProds.length; i++) {
        allProds.push(submittedProds[i]);
      }
      Product.find({"status":"curated"}, function(err, curatedProducts){
        var curatedProds = curatedProducts;
        for (var i = 0; i < curatedProds.length; i++) {
          allProds.push(curatedProds[i]);
        }
        res.json(allProds);
      })
    })
  })

  //get all buyer's tier products
  app.get("/api/buyer/products", function(req, res){
    Product.find({}, function(err, products){
      res.json(products);
    })
  })

  ////get all curated projects for beta buyers (this si all tiers)
  app.get("/api/buyer/products/curated", function(req, res){
    Product.find({"status":"curated"}, function(err, products){
      console.log(products);
      res.json(products);
    })
  })
  app.get("/api/buyer/products/sampleSent", function(req, res){
    Product.find({"status":"sampleSent"}, function(err, products){
      console.log(products);
      res.json(products);
    })
  })
  app.get("/api/buyer/products/sampleRequested", function(req, res){
    Product.find({"status":"sampleRequested"}, function(err, products){
      console.log(products);
      res.json(products);
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
      var comment = new productComment();
      comment.date = new Date();
      comment.sender = req.body.userId;
      comment.commentText = "Welcome, this is where you will be communicating with our team of curators about your product"
      comment.save(function(err, newComment){
        console.log(newComment);
        product.comments.push(newComment._id)
        product.save(function(err, updatedProduct){
          console.log(updatedProduct);
          res.json(updatedProduct);
        })
      })
    })
  })

  /////update a product
  app.post('/api/product/update', function(req, res){
    console.log(req.body);
    Product.findOne({"_id":req.body.projectId}, function(err, product){
      if(err){console.log(err)}
      if (req.body.name) {
        product.name = req.body.name;
      }
      if (req.body.productType) {
        product.productType = req.body.productType;
      }
      if (req.body.vendor) {
        product.vendor = req.body.vendor;
      }
      if (req.body.stitchPattern) {
        product.stitchPattern = req.body.stitchPattern;
      }
      if (req.body.description) {
        product.description = req.body.description;
      }
      //////below, if you send through an array, it knows you are adding to collections, and does that automatically. If you send a single, it knows to subtract that from your current collections
      /////this is to add collections
      if (req.body.collections && (typeof(req.body.collections) == 'array' || typeof(req.body.collections) == 'object')) {
        console.log('in here');
        for (var i = 0; i < req.body.collections.length; i++) {
          product.collections.push(req.body.collections[i]);
        }
      }
      ////this is to delete a specific collection
      if(req.body.collections && typeof(req.body.collections) == 'string'){
        for (var i = 0; i < product.collections.length; i++) {
          if(product.collections[i] == req.body.collections){
            product.collections.splice(i, 1);
          }
        }
      }
      if (req.body.colors) {
        product.colors = req.body.colors;
      }
      if (req.body.fabrics) {
        product.fabrics = req.body.fabrics;
      }
      if (req.body.seasons) {
        product.seasons = req.body.seasons;
      }
      if (req.body.button) {
        product.buttons = req.body.button;
      }
      if (req.body.tier) {
        product.tier = req.body.tier;
      }
      if (req.body.status) {
        product.status = req.body.status;
      }
      if (req.body.images) {
        product.images = req.body.images;
      }
      if (req.body.purchaserInformation) {
        product.purchaserInformation = req.body.purchaserInformation;
      }
      product.save(function(err, product){
        console.log(product);
      res.json(product)
      });
    })
  })

  //////get all purchases
  app.get('/api/purchases', function(req, res){
    Purchase.find({}, function(err, purchases){
      console.log(purchases);
      res.json(purchases);
    })
  })

  /////post a new Purchase to the db
  app.post('/api/new/purchase', function(req, res){
    // console.log(req.body);
    Purchase.create(req.body, function(err, newPurchase){
      console.log(newPurchase);
      res.json(newPurchase)
    })
  })

  ///update just the status
  app.post('/api/update/status', function(req, res){
    Product.findOne({"_id":req.body.prodId}, function(err, productToUpdate){
      productToUpdate.status = req.body.status;
      productToUpdate.save();
      res.json(productToUpdate);
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

    /////now we get the data
    Product.find({'userId':req.params.user}, function(err, products){
      res.json(products);
    })

  })

  ////get all products purchased by a single buyer
  app.get('/api/bought/products/:buyerId', function(req, res){
    var buyerId = req.params.buyerId;
    Product.find({"purchaserInformation.purchaserId": buyerId}, function(err, boughtProducts){
      res.json(boughtProducts);
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
    console.log(req.body);
    Emailcapture.create(req.body, function(err, emailCapture){
      if(err){console.log(err)}
      else{
        console.log(emailCapture);
        res.json(emailCapture)
      }
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
      console.log(user);
  		if (err) {
  			res.json( err )
      }
      else if (user != null) {
  			res.json('user exists')
  		} else {
        //////situation where no user is found (aka email is unique)
				//AUTHENTICATE USER HERE
        var product = new Product();
        var productSub = new Product();
        var productCurateTab = new Product();
        var productCurateSample = new Product();
        var newUser = new User();
        var conversation = new Conversation();

        product.name = "Demo Product";
        product.status = 'saved';
        product.timestamp = new Date();
        product.description = "Detailed description of product will be shown here";
        product.fabrics = [{
          name: 'rayon_challis'
          ,colors: ['red', 'blue', 'white', 'black']
        }
        ,{
          name: 'double_gauze'
          ,colors: ['red', 'black', 'white']
        }
        ,{
          name: 'silk'
          ,colors: ['red', 'yellow', 'blue', 'red']
        }]
        product.images = ['https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/yyunfu5yrokt6kdvbysj.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/uvah7pd0jvgfjnck9hao.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/kvndgmk4duot6xgwcosz.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/jnmx7pvni2c8cxd4nunt.png'];
        product.thumbnails = ['https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/yyunfu5yrokt6kdvbysj.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/uvah7pd0jvgfjnck9hao.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/kvndgmk4duot6xgwcosz.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/jnmx7pvni2c8cxd4nunt.png'];

        productSub.name = "Submitted Demo Product";
        productSub.status = 'submitted to curator';
        productSub.timestamp = new Date();
        productSub.fabrics = [{
          name: 'rayon_challis'
          ,colors: ['red', 'blue', 'white', 'black']
        }
        ,{
          name: 'double_gauze'
          ,colors: ['red', 'black', 'white']
        }
        ,{
          name: 'silk'
          ,colors: ['red', 'yellow', 'blue', 'red']
        }]
        productSub.images = ['https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/yyunfu5yrokt6kdvbysj.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/uvah7pd0jvgfjnck9hao.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/kvndgmk4duot6xgwcosz.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/jnmx7pvni2c8cxd4nunt.png'];
        productSub.thumbnails = ['https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/yyunfu5yrokt6kdvbysj.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/uvah7pd0jvgfjnck9hao.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/kvndgmk4duot6xgwcosz.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/jnmx7pvni2c8cxd4nunt.png'];

        productCurateTab.name = "Curated Demo Product";
        productCurateTab.status = 'curated';
        productCurateTab.timestamp = new Date();
        productCurateTab.fabrics = [{
          name: 'rayon_challis'
          ,colors: ['red', 'blue', 'white', 'black']
        }
        ,{
          name: 'double_gauze'
          ,colors: ['red', 'black', 'white']
        }
        ,{
          name: 'silk'
          ,colors: ['red', 'yellow', 'blue', 'red']
        }]
        productCurateTab.images = ['https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/yyunfu5yrokt6kdvbysj.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/uvah7pd0jvgfjnck9hao.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/kvndgmk4duot6xgwcosz.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/jnmx7pvni2c8cxd4nunt.png'];
        productCurateTab.thumbnails = ['https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/yyunfu5yrokt6kdvbysj.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/uvah7pd0jvgfjnck9hao.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/kvndgmk4duot6xgwcosz.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/jnmx7pvni2c8cxd4nunt.png'];

        productCurateSample.name = "Curated Sample Product";
        productCurateSample.status = 'sampleRequested';
        productCurateSample.timestamp = new Date();
        productCurateSample.fabrics = [{
          name: 'rayon_challis'
          ,colors: ['red', 'blue', 'white', 'black']
        }
        ,{
          name: 'double_gauze'
          ,colors: ['red', 'black', 'white']
        }
        ,{
          name: 'silk'
          ,colors: ['red', 'yellow', 'blue', 'red']
        }]
        productCurateSample.images = ['https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/yyunfu5yrokt6kdvbysj.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/uvah7pd0jvgfjnck9hao.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/kvndgmk4duot6xgwcosz.png', 'https://res.cloudinary.com/hofb/image/upload/c_fill,h_700,w_560/v1453362010/jnmx7pvni2c8cxd4nunt.png'];
        productCurateSample.thumbnails = ['https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/yyunfu5yrokt6kdvbysj.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/uvah7pd0jvgfjnck9hao.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/kvndgmk4duot6xgwcosz.png','https://res.cloudinary.com/hofb/image/upload/c_fill,h_150,w_150/v1453362010/jnmx7pvni2c8cxd4nunt.png'];

        newUser.email = req.body.email;
        newUser.firstname = req.body.firstname;
        newUser.lastname = req.body.lastname;
        newUser.passwordDigest = newUser.generateHash( req.body.password );
        newUser.products.push(product);
        newUser.status = req.body.status;
        newUser.samplesRequested.push()
        newUser.save(function(err, newUserData){
          console.log('testing');
          console.log(newUserData);
          product.userId = newUserData._id;
          productSub.userId = newUserData._id;
          productCurateTab.userId = newUserData._id;
          productCurateSample.userId = newUserData._id;

          product.save(function(err, newProductData){
            console.log(newProductData);
            productSub.save(function(err, newSubmittedProduct){
              console.log(newSubmittedProduct);
              productCurateTab.save(function(err, newCuratedProduct){
                productCurateSample.save(function(err, newCurateSample){
                  console.log(newCurateSample);
                  User.findOne( { email: req.body.email }, function(err, user){
                    console.log(user);
                    user.samplesRequested.push(newCurateSample._id)
                    user.save(function(err, user){
                      console.log(user);
                      console.log(newCuratedProduct);
                      conversation.productName = newProductData.name;
                      conversation.productId = newProductData._id;
                      conversation.dateCreated = new Date();
                      conversation.comments = [{sender: "Admin", receiver: newUserData._id, date: new Date(), text: "Hello, welcome to your first comment"}];
                      conversation.save(function(err, newConvo){
                        if(err){console.log(err)}
                        res.json(newUserData)
                      })
                    })
                  })
                })
              })
            })
          });
        })
  		}
  	})
  })

  //////session and token stuff
  ///////begin the session
  app.post('/api/startsession', function(req, res){
    var password = req.body.password;
    User.findOne({'email': req.body.email}, function(err, user){
      if(err){console.log(err)}
      else if(user == null){
        res.json('no user')
      }
      else {
        console.log(user.validPassword(password));
        if (user.validPassword(password) == true) {
          if(!user.signins){
            user.signins = 0;
          }
          user.signins += 1;
          user.save(function(err, updatedUser){
            if(err){console.log(err)}
            console.log(updatedUser);
            var userId = updatedUser._id;
            var status = user.status;
            var secret = process.env.JWT_TOKEN_SECRET;
            ///////iss == issuer (us), name = the user's id, and sub = the number of times they've logged in
            var token = jwt.sign({iss: "hofb.com", name: user._id, sub: user.signins, aud: status}, secret, {expiresIn: "2h", audience: user.status})
            res.json(token);
          })
        }
        else {
          res.json("password incorrect");
        }
      }
    })
  })

  app.get('/api/endtour/:userId', function(req, res){
    User.findOne({_id: req.params.userId}, function(err, user){
      user.signins = user.signins+1;
      user.save(function(err, user){
        var token = jwt.sign({iss: "hofb.com", name: user._id, sub: user.signins, aud: "designer"}, process.env.JWT_TOKEN_SECRET, {expiresIn: "2h", audience: user.status})
        res.json(token);
      })
    })
  })

  ///////check the users status from the jwt web token (as "audience")/////
  app.get('/api/checkstatus/:jwt', function(req, res){
    var token = req.params.jwt;
    console.log(token);
    jwt.verify(token, process.env.JWT_TOKEN_SECRET, function(err, decodedToken){
      console.log(decodedToken);
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

  app.post('/api/pictures', upload.array('files', 8), function(req,res){
    for (var i = 0; i < req.files.length; i++) {
      var fileName = req.files[i].filename;
      var destination = req.files[i].destination
      //Uploads to cloudinary, returns URL -> uploadResult is the new photo URL
      cloudinary.uploader.upload(destination+fileName, function(uploadResult){
        console.log(uploadResult);
        var id = req.body.productId;
        //grabs ID from above line, does a search on DB with that ID below
        Product.findOne({"_id": id}, function(err, product){
          if(err){console.log(err)}
          //push 500x700 adn 150x150 images for all images
          product.thumbnails.push(uploadResult.eager[0].secure_url);
          product.images.push(uploadResult.eager[1].secure_url);
          //user.photo = uploadResult.secure_url
          //consol.log uploadResult.secure_url for userProfile
          product.save({}, function(err, updatedProduct){
            ///////now we update the conversation to get the photo
            Conversation.findOne({productId: updatedProduct._id}, function(err, convo){
              // console.log(convo);
              // console.log(432);
              console.log(updatedProduct);
              convo.photoUrl = updatedProduct.images[0];
              convo.save({}, function(err, newConvo){
                // console.log(newConvo);
              })
            })
          });
        })
      },
      {
        eager: [
           { width: 150, height: 150,
             crop: "fill", format: "png" },
           { width: 560, height: 700,
            crop: 'fill', format: "png" }
        ]
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

  ///////////////////////////////////////
  /////Begin user profile photo upload logic///////
  // var uploading = multer({
  //   dest: __dirname + '../public/uploads/',
  // })

  app.post('/api/profile/pictures', upload.single('profile'), function(req,res){

    console.log(req.files); // as soon as req.files starts showing on the API side.
    // for (var i = 0; i < req.files.length; i++) {
    //   var fileName = req.files[i].filename;
    //   console.log(filename);
    //   var destination = req.files[i].destination
    //   console.log(destination);
    //   //Uploads to cloudinary, returns URL -> uploadResult is the new photo URL
    //   cloudinary.uploader.upload(destination+fileName, function(uploadResult){
    //     console.log(uploadResult);
    //     var id = req.body.userId;
    //     console.log(id);
    //     //grabs ID from above line, does a search on DB with that ID below
    //   //   User.findOne({"_id": id}, function(err, user){
    //   //     console.log(user);
    //   //     if(err){console.log(err)}
    //   //     //push is for an array, if profile photo is a string might need to use a diff
    //   //     product.images.push(uploadResult.secure_url);
    //   //     //user.photo = uploadResult.secure_url
    //   //     //consol.log uploadResult.secure_url for userProfile
    //   //     product.save({}, function(err, userData){
    //   //       console.log(userData);
    //   //     })
    //   // })
    // })
  // }
})


  /////End user profile photo upload logic/////////
  ////////////////////////////////////////////////

  //////////////////////////////////////////
  /////begin email stuff////////////////////
  app.post('/api/sendemail', function(req, res){
    mandrill_client.messages.send({
      message: {
        from_email: "thankyou@hofb.com"
        ,html:
        "<divs>"+
          "<img src='http://i.imgur.com/f5T6U5B.png' style='width:250px'>"+
          "<h2 style='color:#737373'>Thank you for joining HOFB. We’re gearing up to introduce you to our exciting new platform, created solely for the purpose of making your work and life easier! In the coming days and weeks, you will receive a link via e-mail which will invite you to enter and start using the closed beta HOFB platform.</h2> "+
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

  ///////////Password verification email /////////////////
  app.post('/api/email/password', function(req, res){
    var resetLink = req.body.resetLink;
    mandrill_client.messages.send({
      message: {
        from_email: "support@hofb.com"
        ,html:
        "<div>"+
          "<img src='http://i.imgur.com/f5T6U5B.png' style='width:250px'>"+
          "<h2 style='PW reset Link here"+
          "<br>"+
          "Click on the link within this email to update your passsword</h2>"+
          "<h2 style='color:#293d3d'>HOFB</h2>"+
          "<h3 style='color:#293d3d'>Los Angeles</h3>"+
          "<h2>Reset Your Password Here:"+resetLink+"</h2>"+
        "</div>"
        ,subject: "HOFB Password Verification"
        ,to:[{
          email: req.body.email
        }]
      }
    }, function(data){
      res.json(data)
    })
  })

  ///////////Beta Signup Email /////////////////
  app.post('/api/email/betasignup', function(req, res){
    var signupLink = req.body.signupLink;
    mandrill_client.messages.send({
      message: {
        from_email: "support@hofb.com"
        ,html:
        "<div>"+
          "<img src='http://i.imgur.com/f5T6U5B.png' style='width:250px'>"+
          "<h2 style='color:#737373'>Welcome to HOFB beta.<br><br>Thank you for signing up to use HOFB portal and we appreciate your patience. We have been hard at work building beautiful and necessary useful fashion technology products for independent fashion designers and retailers. <br><br>In building HOFB interactive technology to make your fashion life easier, we need your feedback during this beta to roll out additional features in a timely manner.. All feedback is valuable to our continuing development. <br><br> Enjoy!<h2 style='color:#293d3d'>HOFB</h2><h3 style='color:#293d3d'>Los Angeles</h3>"+
          "<h2>Signup Here:"+signupLink+"</h2>"+
        "</div>"
        ,subject: "HOFB Signup"
        ,to:[{
          email: req.body.email
        }]
      }
    }, function(data){
      res.json(data)
    })
  })
///////////////////////////////////////////////////////////////
  /////get all emails from splash collection to email back to us
  app.get('/api/emails', function(req, res){
    Emailcapture.find({}, function(err, emails){
      var allEmails = [];
      for (var i = 0; i < 35; i++) {
        var passBool = true;
        for (var j = 0; j < allEmails.length; j++) {
          if(emails[i] == allEmails[j]){
            passBool = false;
          }
        }
        if(passBool){
          allEmails.push(emails[i].email)
        }
      }
      var uniqueArray = allEmails;
      var emailStringFunc = function(){
        var eString = "";
        for (var i = 0; i < uniqueArray.length; i++) {
          eString = eString+" "+uniqueArray[i]+",";
        }
        return eString;
      }
      var emailString = emailStringFunc();
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
    productComment.find({}, function(err, productComments){
      if(err) console.log(err)
      res.json(productComments)
    })
  })

  /////get all comments sent to a specific user
  app.get('/api/view/comments/:receiverId', function(req, res){
    productComment.find({"receiver": "56719a11ee024833030efede"}, function(err, comments){
      res.json(comments)
    })
  })

  /////get a single comment
  app.get('/api/comment/:messageId', function(req, res){
    var messageId = req.params.messageId;
    productComment.findOne({"_id":messageId},function(err, message){
      if(err){console.log(err)}
      res.json(message);
    })
  })


  ///Posting a single comment
  app.post("/api/product/comment", function(req, res){
    productComment.create(req.body, function(err, productComment){
      if(err) throw err;
      res.json(productComment);
    })
  })

  //////logic for getting all conversations of a specific user
  app.get('/api/conversations/:user_id', function(req, res){
    Conversation.find({'ownerId': req.params.user_id}, function(err, conversations){
      res.json(conversations);
    })
  })

  //////logic for getting all conversations of a specific Product
  app.get('/api/conversation/:product_id', function(req, res){
    console.log(req.body);
    Conversation.findOne({'productId': req.params.product_id}, function(err, conversations){
      res.json(conversations);
    })
  })

  /////post a new conversation
  app.post('/api/new/conversation', function(req, res){
    Conversation.create(req.body, function(err, newConvo){
      if(err){console.log(err)}
      console.log(newConvo);
      res.json(newConvo)
    })
  })

  /////Update a new message to a conversation
  app.post('/api/conversation', function(req, res){
    console.log(req.body);
    Conversation.findOne({"productId": req.body.productId}, function(err, conversation){
      if(err){console.log(err)}
      console.log(conversation);
      conversation.comments.push({sender: req.body.sender, commentText: req.body.commentText, date: new Date(), receiver: 'admin'})
      conversation.save(function(err, newConversation){
        res.json(newConversation);
      })
    })
  })

  /////End of commenting system ////////
  /////////////////////////////////////
  /////////////////////////////////////

  app.post('/api/checkpassword/production', function(req, res){
    if(req.body.password == "SledFive"){
      res.json(true);
    }
  })

  //////////////api route to check verify a password to a new Password
  app.post('/api/check/password', function(req, res){
    var oldPassword = req.body.password;
    User.findOne({"_id": req.body.userId}, function(err, user){
      var bool = user.validPassword(oldPassword);
      res.json(bool)
    })
  })

  /////////////////////////////////////////////////
  /////////Begin Routes for Sampling and Purchasing
  app.post('/api/new/sample', function(req, res){
    Sample.create(req.body, function(err, newSample){
      console.log(newSample);
      res.json(newSample);
    })
  })

  app.post('/api/update/sample', function(req, res){
    console.log(req.body);
    if(req.body)
    Sample.findOne({"productId":req.body.productId}, function(err, sample){
      if(err){console.log(err)}
      else if(sample != null){
        console.log('before');
        console.log(sample);
        sample.status = req.body.status;
        sample.sampleCreator = req.body.sampleCreator;
        sample.save(function(){
          res.json(sample);
        });
      }
      else {
        res.json('no product');
      }
    })
  })
  /////////End Routes for Sampling and Purchasing//
  /////////////////////////////////////////////////
}



var db = process.env.DB_URL_HOFB_DEVELOPMENT;
mongoose.connect(db);
