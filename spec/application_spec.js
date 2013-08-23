require('monckoose');

var Config = require('../config');
var Application = require('../application.js');

describe('Application', function () {
	'use strict';

	var application;

	beforeEach(function () {
		application = new Application({
			jsDomOptions: Config.test.jsDomOptions
		});
	});

	describe('parse()', function () {
		it("should parse the list of items in the given page", function(done) {
			application.parse(Config.test.startPage, function (result) {
				expect(result.items.length).toBe(55);
				done();
			});
		});
	});

	describe('generateParseNextPageDelay()', function () {
		it("should return a value between 7500 and 12500", function(done) {
			var result = application.generateParseNextPageDelay();

			expect(result >= 7500).toBeTruthy();
			expect(result <= 12500).toBeTruthy();
		});
	});
});