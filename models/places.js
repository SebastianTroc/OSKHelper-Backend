// The Place model

var mongoose 	= require('mongoose')
  ,	Schema 		= mongoose.Schema
  ,	ObjectId 	= Schema.ObjectId;

var placeSchema = new Schema({
    place: ObjectId,
    name: String,
    address: String,
    photo: String,
    coordinates: {
    	lat: Number,
    	lng: Number
    },
    occupated: Boolean
});

module.exports = mongoose.model('Place', placeSchema);