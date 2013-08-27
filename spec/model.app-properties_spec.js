var moment = require('moment');
var AppPropertiesModel = require('../model.app-properties.js');

describe('AppPropertiesModel', function () {
	'use strict';

	var appPropertiesModel;

	describe('new appPropertiesModel()', function () {
		it("should have by default a date equal to 3 days ago", function() {

			appPropertiesModel = new AppPropertiesModel();
			var expectedDate = moment().subtract('days', 10).startOf('day').toDate();
			
			expect(appPropertiesModel.get('oldestFlatFetch')).toEqual(expectedDate);
		});
	});
});