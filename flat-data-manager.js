// Count all of the links from the nodejs build page
var mongoose = require('mongoose');
var events = require('events');

var FlatDataManager = function FlatDataManager(options, callback) {
  // Requires a libraries property
  this.options = options;
  this.events = new events.EventEmitter();

  mongoose.connect('mongodb://localhost/flathunt', function (err, res) {
    if (err) {
      console.log('Error!');
    } 

    console.log('open');
    this.flatSchema = mongoose.Schema({
      id: String,
      title: String,
      date: String,
      link: String
    });

    this.flatModel = mongoose.model('flats', this.flatSchema);

    this.events.emit('initialized');
    callback();

  }.bind(this));
};

FlatDataManager.prototype.saveFlat = function saveFlat(flat) {
  var newFlat = new this.flatModel(flat);
  console.log(newFlat);

  newFlat.save(function (err, elem) {
    if (err) {
      console.log("Can't save ", elem);
    }
  });
};


FlatDataManager.prototype.flatExists = function flatExists(flatId, callback) {
  this.flatModel.find({
    id: flatId
  }, function (err, res) {
    if (err) {
      console.log('Error!');
    }

    var result = res.length > 0;

    callback(err, result);
  });
};

module.exports = FlatDataManager;