var mongoose = require('mongoose');

var Persistency = function Persistency(options) {
	this.options = options;
};

Persistency.prototype.connect = function connect(onDone) {
	mongoose.connect('mongodb://localhost/flathunt', function (err, res) {
		if (err) {
			console.log('Error connecting to Mongo!');
			return;
		}

		onDone();
	});
}

module.exports = Persistency;