var mongoose = require('mongoose');

var FlatSchema = mongoose.Schema({
    id: String,
    title: String,
    price: Number,
    date: Date,
    link: String
  });

var FlatModel = mongoose.model('flats', FlatSchema);

module.exports = FlatModel;