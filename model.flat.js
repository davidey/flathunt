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

    description: String,
    bedrooms: Number,
    latitude: Number,
    longitude: Number,
    images: mongoose.Schema.Types.Mixed,

    createdAt: {type: Date, default: new Date()},
    isFetched: {type: Boolean, default: false}
  });

var FlatModel = mongoose.model('flats', FlatSchema);

module.exports = FlatModel;