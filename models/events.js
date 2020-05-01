//Require Mongoose
var mongoose = require('mongoose');

// Define schema
var Schema = mongoose.Schema;

var EventModelSchema = new Schema({
  title:String,
  startDate:Date,
  endDate:Date,
  notes:String,
  
});
EventModelSchema.virtual('url').get(function(){
  return '../event/' + this._id;
});


// Compile model from schema
module.exports = mongoose.model('Event', EventModelSchema );