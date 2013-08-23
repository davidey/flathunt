var mongoose = require('mongoose');
var _ = require('underscore');

var AppPropertiesModel = require('./model.app-properties.js');

var Persistency = function Persistency(uri, options) {
	this.uri = uri;

	this.defaultOptions = {
		connectionOptions: {}
	}

	this.options = _.extend(this.defaultOptions, options);
};

Persistency.prototype.connect = function connect(onDone) {
	mongoose.connect(this.uri, this.options.connectionOptions, function (err, res) {
		if (err) {
			console.log('Error connecting to persistency!');
			return;
		}

		onDone();
	});
};

Persistency.prototype.loadAppProperties = function loadAppProperties(onDone) {
	AppPropertiesModel.findOne({}, function (err, result) {
		if (result) {
			appProperties = result;
		} else {
			appProperties = AppPropertiesModel.create({}, function () {});
		}

		onDone(appProperties);
	}.bind(this));
}

module.exports = Persistency;