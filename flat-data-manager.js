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

  console.log('Saving flat ' + newFlat.get('id'));

  newFlat.save(function (err, elem) {
    if (err) {
      console.log("Can't save ", flat, err);
    }
  });
};

FlatDataManager.prototype.updateFlat = function updateFlat(flat) {
  console.log('Updating flat ' + flat.id);

  FlatModel.update({id: flat.id}, flat, function (err, elem) {
    if (err) {
      console.log("Can't update ", flat, err);
    }
  });
};

FlatDataManager.prototype.getUnfetchedFlats = function getUnfetchedFlats(onDone) {
  FlatModel.find({
    isFetched: false
  }, function (err, res) {
    if (err) {
      console.log('Error in getUnfetchedFlats');
    }

    onDone(res);
  });
};

FlatDataManager.prototype.flatExists = function flatExists(flatId, onDone) {
  FlatModel.find({
    id: flatId
  }, function (err, res) {
    if (err) {
      console.log('Error!');
    }

    var result = res.length > 0;

    onDone(err, result);
  });
};

module.exports = FlatDataManager;