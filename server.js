var express        = require('express');
var path           = require('path');
var dotenv         = require('dotenv').load();
// var favicon = require('serve-favicon');
var logger         = require('morgan');
var cookieParser   = require('cookie-parser');
var bodyParser     = require('body-parser');
var http           = require('http');
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var passport       = require('passport');
var passportlocal = require('passport-local');
console.log(passport);
var app            = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/////signup stuff
app.use(passport.initialize());
app.use(passport.session());
require('./passport.js')(passport);

require('./api.js')(app);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(process.env.PORT || '5555');

app.get('*', function(req, res){

  res.sendFile( __dirname + '/public/index.html')
})

// mongoose.createConnection(process.env.DB_URL_HOFB);
// // mongoose.createConnection('mongodb://jackconnor:Skateboard1@ds063134.mongolab.com:63134/hofbsplash');
// // mongoose.createConnection(mongoose.connect(ENV['DB_URL'])
// // );
module.exports = app;
