// The Place model

var mongoose 	= require('mongoose')
  ,	Schema 		= mongoose.Schema
  ,	ObjectId 	= Schema.ObjectId
  , instructorSchema = require('./instructors');

var placeSchema = new Schema({
    place: ObjectId,
    name: String,
    address: String,
    photo: String,
    photoBase64: String,
    coordinates: {
      lat: Number,
     	lng: Number
    },
    occupation: {
        occupied: { type: Boolean, default: false },
        who: [instructorSchema]
    }
});

module.exports = mongoose.model('Place', placeSchema);