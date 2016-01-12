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
var Emailcapture       = require('./models/emailCapture.js');
var User               = require('./models/user.js');
var userProfile        = require('./models/userProfile.js');
var Product            = require('./models/product.js');
var Project            = require('./models/createProject.js');
var viewProduct        = require('./models/viewProduct.js');
var Photo              = require('./models/photo.js');
var productComment     = require('./models/productComment.js');
var Conversation       = require('./models/conversation.js');
var Purchase           = require('./models/purchase.js')
console.log("david");
// console.log(Purchase);
console.log('bowie');
///////finish bringing models////
/////////////////////////////////

module.exports = function(app){

  /////////////////////////////////
  ////////begin user api requests////

  //get all createProjects
  app.get('/api/createprojects', function(req, res){
    Project.find({}, function(err, projects){
      if(err) console.log(err)
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
    console.log(req.params);
    User.findOne({"_id":req.params.id}, function(err, user){
      if(err) throw err;
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

  ///Post for updating user profile
  // app.post("/api/user/profile", function(req, res){
  //   User.insert(req.body, function(err, User){
  //     if(err) throw err;
  //     res.json(User);
  //   })
  // })

  ///create a new user
  app.post('/api/users', function(req, res){
    User.create(req.body, function(err, user){
      if(err){console.log(err)}
      ////json with info of new user we created
      console.log(user);
      res.json(user)
    })
  })

  /////post call to update a user profile
  app.post('/api/users/update', function(req, res){
    console.log(req.body);
    User.findOne({"_id":req.body.userId}, function(err, user){
      console.log(user);
      if(err){console.log(err)}
      if(req.body.email){
        user.email = req.body.email
      }
      if(req.body.password){
        user.password = req.body.password
      }
      if(req.body.location){
        user.location = req.body.location
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
      if(req.body.status){
        user.status = req.body.status;
      }
      if(req.body.username){
        user.username = req.body.username
      }
      if(req.body.bio){
        user.bio = req.body.bio
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

  ////get all buyer's tier products
  app.get("/api/buyer/products/:tier", function(req, res){
    Product.find({"tier":req.params.tier}, function(err, products){
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
    Product.create(req.body, function(err, product){
      if(err) throw err;
      res.json(product);
    })
  })

  /////update a product
  app.post('/api/product/update', function(req, res){
    console.log(req.body);
    Product.findOne({"_id":req.body.projectId}, function(err, product){
      console.log(product);
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
      if (req.body.collections) {
        for (var i = 0; i < req.body.collections.length; i++) {
          product.collections.push(req.body.collections[i]);
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
  		if (err ) {
  				res.json( err )
  		} else if ( user ) {
  			res.redirect( '/')
  		} else {
        //////situation where no user is found (aka email is unique)
  			var newUser = new User();
  			newUser.email = req.body.email
  			newUser.passwordDigest = newUser.generateHash( req.body.password )
        newUser.status = req.body.status;
  			newUser.save( function( err, user ) {
  				if ( err ) { console.log(err) }
  				//AUTHENTICATE USER HERE
          console.log(user);
          Product.create({'name':"Demo Product", userId: user._id, status: 'saved', timestamp: new Date(), images:['https://www.easygenerator.com/wp-content/uploads/2013/09/demo.jpg']}, function(err, product){
            console.log(product);
            res.json(user)
          })
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
      if (user && user.validPassword(password)) {
        if(!user.signins){
          user.signins = 0;
        }
        console.log('before');
        console.log(user);
        user.signins = user.signins+1;
        console.log('after');
        console.log(user);
        user.save(function(err, user){
          var userId = user._id;
          var status = user.status;
          var secret = process.env.JWT_TOKEN_SECRET;
          //////user password verified
          ///////iss == issuer (us), name = the user's id, and sub = the number of times they've logged in
          var token = jwt.sign({iss: "hofb.com", name: user._id, sub: user.signins}, secret, {expiresIn: "24h", audience: user.status})
          res.json(token);
        })
      }
      else {
        res.json({data: 'sorry no token'})
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

  app.post('/api/pictures', upload.array('files', 8), function(req,res){
    for (var i = 0; i < req.files.length; i++) {
      console.log();
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
           { width: 500, height: 700,
            format: "png" }
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
    // console.log(req.body);
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
    console.log('yo');
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

  ///////////Password verification email /////////////////
  app.post('/api/email/password', function(req, res){
    mandrill_client.messages.send({
      message: {
        from_email: "support@hofb.com"
        ,html:
        "<divs>"+
          "<img src='http://i.imgur.com/f5T6U5B.png' style='width:250px'>"+
          "<h2 style='color:#737373'>Thank you for joining HOFB. We’re gearing up to introduce you to our exciting new platform, created solely for the purpose of making your work and life easier! In the coming days and weeks, you will receive a link via e-mail which will invite you to enter and start using the closed beta HOFB platform. "+
          "<br>"+
          "Please bear with us while we onboard users gradually.</h2>"+
          "<h2 style='color:#293d3d'>HOFB</h2>"+
          "<h3 style='color:#293d3d'>Los Angeles</h3>"+
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

}



var db = process.env.DB_URL_HOFB;
mongoose.connect(db)
