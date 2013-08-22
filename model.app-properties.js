var mongoose = require('mongoose');
var moment = require('moment');

var appPropertiesSchema = mongoose.Schema({
	oldestFlatFetch: {
		type: Date,
		// Set the default date to 3 days ago
		default: moment().subtract('days', 3).startOf('day')
	},
});

var AppPropertiesModel = mongoose.model('AppProperties', appPropertiesSchema);

module.exports = AppPropertiesModel;