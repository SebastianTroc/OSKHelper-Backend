// The Checksum model

var mongoose    = require('mongoose')
  , Schema      = mongoose.Schema
  , ObjectId    = Schema.ObjectId;

var settingsSchema = new Schema({
    key: String,
    value: String
});

module.exports = mongoose.model('Settings', settingsSchema);