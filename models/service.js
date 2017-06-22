// load the things we need
var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

// define the schema for our user model
var serviceSchema = mongoose.Schema({
    serviceid : Number,
    name : String,
    comments: String,
    subject: String,
    servicelist: Array

});



// create the model for users and expose it to our app
module.exports = mongoose.model('Service', serviceSchema);
