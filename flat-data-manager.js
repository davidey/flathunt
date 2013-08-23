// Count all of the links from the nodejs build page
var events = require('events');
var FlatModel = require('./model.flat.js');

var FlatDataManager = function FlatDataManager(options) {
  // Requires a libraries property
  this.options = options;
  this.events = new events.EventEmitter();

  this.events.emit('initialized');
};

FlatDataManager.prototype.saveFlat = function saveFlat(flat) {
  var newFlat = new FlatModel(flat);

  newFlat.save(function (err, elem) {
    if (err) {
      console.log("Can't save ", elem);
    }
  });
};

FlatDataManager.prototype.flatExists = function flatExists(flatId, callback) {
  FlatModel.find({
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