// The Instructors model

var mongoose 	= require('mongoose')
  ,	Schema 		= mongoose.Schema
  ,	ObjectId 	= Schema.ObjectId;

var instructorSchema = new Schema({
    instructor: ObjectId,
    name: String,
    photo: String,
    login: String,
    password: String,
    coordinates: {
    	lat: Number,
    	lng: Number
    },
    phone: String,
    email: String
});

module.exports = mongoose.model('Instructors', instructorSchema);