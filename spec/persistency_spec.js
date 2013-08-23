require('monckoose');

var Config = require('../config');
var Persistency = require('../persistency.js');

describe('Persistency', function () {
	'use strict';

	var persistency;
	var settings = Config.test;

	beforeEach(function () {
		persistency = new Persistency(settings.persistency.uri, {
			connectionOptions: settings.persistency.options
		});
	});

	describe('on construction', function () {
		it("should extend the default options with the given ones", function() {
			expect(persistency.options.connectionOptions).toEqual(settings.persistency.options);
		});
	});

	describe('connect()', function () {
		it("should call the given callback on successful connection", function() {

			var flag = false;

			var callback = function () {
				flag = true;
			}

			runs(function () {
				persistency.connect(callback);
			});

			waitsFor(function() {
				return flag;
			}, "", 1000);

			runs(function() {
				expect(flag).toBeTruthy();
			});
		});
	});
});