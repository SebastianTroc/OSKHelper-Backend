// The Instructors model

var mongoose 	= require('mongoose')
  ,	Schema 		= mongoose.Schema
  ,	ObjectId 	= Schema.ObjectId
  , placeSchema = require('./places');

var instructorSchema = new Schema({
    instructor: ObjectId,
    name: String,
    // photo: String,
    login: String,
    password: String,
    // coordinates: {
    // 	lat: Number,
    // 	lng: Number
    // },
    phone: String,
    email: String,
    relPlace: [placeSchema]
});

module.exports = mongoose.model('Instructors', instructorSchema);