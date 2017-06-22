// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var app      = express();
var port     = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');
var Debug =require('debug');
var morgan       = require('morgan');
var path   = require('path');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');


//import , set the path for Service routes
//var serviceRoutes =  require('./routes/service');



//for debugging
const debug = Debug('easy-node-authentication:app');

//the mongodb path
var configDB = require('./config/database.js');

// configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database

require('./config/passport')(passport); // pass passport for configuration

// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, './public')));
app.use(express.static(path.join(__dirname, './controllers')));

/**
 * Controllers (route handlers).
 */
//
//const serviceController = require('./controllers/service');
// const userController = require('./controllers/user');
// const apiController = require('./controllers/api');
// const contactController = require('./controllers/contact');

/*
* Routes path here
*/
//app.use('/seekhelp',require('./routes/form'));
//set the path for service routes


// required for passport
app.use(session({
    secret: 'ilovescotchscotchyscotchscotch', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// Passport routes ======================================================================
require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport
//require('./routes/service.js')(app);
//app.use('/seekhelp', serviceRoutes);
// launch ======================================================================
app.listen(port);
console.log('Running on port: ' + port);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
/* eslint no-unused-vars: 0 */
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Handle uncaughtException
process.on('uncaughtException', (err) => {
  debug('Caught exception: %j', err);
  process.exit(1);
});
