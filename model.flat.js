var mongoose = require('mongoose');

var FlatSchema = mongoose.Schema({
    id: String,
    title: String,
    price: Number,
    date: Date,
    link: String,

    description: String,
    bedrooms: Number,
    latitude: Number,
    longitude: Number,
    images: mongoose.Schema.Types.Mixed
  });

var FlatModel = mongoose.model('flats', FlatSchema);

module.exports = FlatModel;