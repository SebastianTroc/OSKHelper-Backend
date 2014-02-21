// The Instructors model

var mongoose 	= require('mongoose')
  ,	Schema 		= mongoose.Schema
  ,	ObjectId 	= Schema.ObjectId;

var instructorSchema = new Schema({
    instructor: ObjectId,
    name: String,
    login: String,
    password: String,
    phone: String,  
    email: String
});

module.exports = mongoose.model('Instructors', instructorSchema);