var mongoose = require('mongoose');

var FlatSchema = mongoose.Schema({
    id: String,
    title: String,
    date: Date,
    link: String
  });

var FlatModel = mongoose.model('flats', FlatSchema);

module.exports = FlatModel;