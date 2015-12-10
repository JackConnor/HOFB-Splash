//config/passport.js

var LocalStrategy = require('passport-local').Strategy;

var User = require('./models/user.js');

module.exports = function(passport){

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  console.log('in here 2');
  passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
      done(err, user);
    });
  });
  console.log('in here 3');

  //////local signup stuff

  passport.use(
    'local-signup', new LocalStrategy({
    emailField: "email",
    passwordField: 'password',
    passReqToCallback: true
  },
  function(req, email, password, done){
    console.log('well at least I got this far');
    process.nextTick(function(){

      User.findOne({ 'local.email': email }, function(err, user){
        if(err){return done(err)}
        else if(user){
          return done(null, false, req.flash('signupmessage', 'that email is already taken'))
        } else {

          var newUser  = new User();

          newUser.local.email  = email;
          newUser.local.password = newUser.generateHash(password);

          newUser.save(function(err){
            if(err){throw err}

            return done(null, newUser)
          });

        }
      });
    }
  );

  })
);
}
