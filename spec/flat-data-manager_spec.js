var monckoose = require('monckoose');

var Config = require('../config');
var FlatDataManager = require('../flat-data-manager.js');
var Persistency = require('../persistency.js');

var settings = Config.test;

var persistency = new Persistency(settings.persistency.uri, {
	connectionOptions: settings.persistency.options
});

persistency.connect(function () {
	describe('FlatDataManager', function () {
		'use strict';

		var flatDataManager;


		beforeEach(function () {
			flatDataManager = new FlatDataManager({});
		});

		describe('getUnfetchedFlats()', function () {
			it("should return in callback the list of unfetched flats", function(done) {
				flatDataManager.getUnfetchedFlats(function (result) {
					expect(result.length).toBe(8);
					done();
				});
			});
		});
	});
});