var mongoose = require('mongoose');
var moment = require('moment');

var appPropertiesSchema = mongoose.Schema({
	oldestFlatFetch: {
		type: Date,
		// Set the default date to 3 days ago
		default: moment().subtract('days', 10).startOf('day').toDate()
	},
});

var AppPropertiesModel = mongoose.model('AppProperties', appPropertiesSchema);

module.exports = AppPropertiesModel;