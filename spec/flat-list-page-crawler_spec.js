var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');
var Config = require('../config.js');
var FlatListPageCrawler = require('../flat-list-page-crawler.js');

var Settings = Config.test;

var flatListItemStub = fs.readFileSync(path.join(__dirname,'../mock/flatlist-item.htm'), 'utf8');

describe('FlatListPageCrawler', function () {
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

	describe('parseItem()', function () {
		it("should return an array of properties of the parsed item", function(done) {
			  jsdom.env(
			    flatListItemStub,
			    Settings.jsDomOptions.scripts,
			    function (errors, window) {
			      var $item = window.$('.hlisting');
			      var result = flatListPageCrawler.parseItem($item);

			      expect(result.id).toBe('1027265253');
			      expect(result.title).toBe('DOUBLE ROOM/HOUSE SHARE WITH ALL BILLS + WIFI , IN DALSTON E8');
			      expect(result.date).toBe('2013-08-08T11:00:43+01:00');
			      expect(result.price).toBe('155');
			      expect(result.pricePeriod).toBe('pw');
			      expect(result.link).toBe('http://www.gumtree.com/p/flats-houses/double-roomhouse-share-with-all-bills-wifi-in-dalston-e8/1027265253');
			      expect(result.thumbnail).toBe('http://i.ebayimg.com/00/s/NDgwWDY0MA==/$(KGrHqZHJCoFH)t+uj)oBR-4LFeMT!~~48_5.JPG');
			      expect(result.sellerType).toBe('Agency');

			      done();
			    }.bind(this)
			  );
		});
	});
});