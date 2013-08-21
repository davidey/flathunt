var Config = require('../config.js');
var FlatListPageCrawler = require('../flat-list-page-crawler.js');

var Settings = Config.dev;

describe('BK.Api', function () {
	'use strict';

	var flatListPageCrawler;

	beforeEach(function () {
		flatListPageCrawler = new FlatListPageCrawler({
			jsDomOptions: Settings.jsDomOptions
		});
	});

	describe('crawl()', function () {
		it("should return an array of flat announces and the next page link", function(done) {
			flatListPageCrawler.crawl(Settings.startPage, function (results) {
				expect(results.items.length > 0).toBeTruthy();
				expect(results.nextPageLink).toBe('http://www.gumtree.com/flats-and-houses-for-rent-offered/london/page2');
				done();
			});
		});
	});
});