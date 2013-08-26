require('monckoose');

var Config = require('../config');
var Application = require('../application.js');
var AppPropertiesModel = require('../model.app-properties.js');

var Settings = Config.test

describe('Application', function () {
	'use strict';

	var application;
	var appPropertiesModel = new AppPropertiesModel();

	beforeEach(function () {
		application = new Application(appPropertiesModel, {
			jsDomOptions: Config.test.jsDomOptions
		});
	});

	describe('start()', function () {
		it("should run the crawlQueue", function() {
			application.start(Settings.startPage)

			expect(application.crawlQueue.isRunning).toBeTruthy();
		});
	});

	describe('endFlatListCrawling()', function () {
		beforeEach(function () {
			application.start(Settings.startPage);
			application.endFlatListCrawling();
		});

		it("should stop the crawlQueue", function() {
			expect(application.crawlQueue.isRunning).toBeFalsy();
		});

		it("should set the new date into the appPropertiesModel", function() {
			expect(application.appProperties.get('oldestFlatFetch')).toEqual(application.startDate);
		});
	});

	xdescribe('parse()', function () {
		it("should parse the list of items in the given page", function(done) {
			application.parse(Config.test.startPage, function (result) {
				expect(result.items.length).toBe(55);
				done();
			});
		});
	});
});