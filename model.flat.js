var mongoose = require('mongoose');

var FlatSchema = mongoose.Schema({
    id: String,
    title: String,
    price: Number,
    pricePeriod: String,
    date: Date,
    link: String,
    thumbnail: String,
    sellerType: String,
    location: String,
    availableDate: Date,


    isFetched: false,

    description: String,
    bedrooms: Number,
    latitude: Number,
    longitude: Number,
    images: mongoose.Schema.Types.Mixed
  });

var FlatModel = mongoose.model('flats', FlatSchema);

module.exports = FlatModel;