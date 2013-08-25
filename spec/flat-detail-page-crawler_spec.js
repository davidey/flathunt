var fs = require('fs');
var path = require('path');
var jsdom = require('jsdom');
var Config = require('../config.js');
var FlatDetailsPageCrawler = require('../flat-details-page-crawler.js');

var Settings = Config.test;

describe('FlatDetailsPageCrawler', function () {
	'use strict';

	var flatDetailsPageCrawler;
	var pageUri = __dirname + '/../mock/flatdetail.html';

	beforeEach(function () {
		flatDetailsPageCrawler = new FlatDetailsPageCrawler({
			jsDomOptions: Settings.jsDomOptions
		});
	});

	describe('crawl()', function () {
		it("should return a the details for the flat", function(done) {
			flatDetailsPageCrawler.crawl(pageUri, function (result) {
				expect(result.id).toBe('1026551843');
				//expect(result.description).toEqual("VERY SPACIOUS, 2 bedroom 2 bathroom property located in the Mayfair, almost directly opposite Londons famous Selfridges.<br><br> A superb and stylish large two bed, two bath third floor apartment, with a spacious living room, separate (but it could be turned into an open plan) modern kitchen with a utilities room, overlooking Oxford Street and almost directly opposite Selfridges.<br><br>Gilbert Street is ideally located in Mayfair, in the heart of London's West End. Mayfair is the most desirable place to live in London positioned between the open spaces of Hyde Park and Green Park, and close to Hyde Park Corner. It boasts some of the capital's most exclusive shops, hotels, restaurants and clubs. A stone throw away from the apartment is the world famous shops of Oxford Street and Bond Street, which people come from all over to world to visit. Excellent local transport links include connections from Bond Street (a few minutes walk) London Underground (Central and Jubilee lines) Marble Arch London Underground (Central line) and Green Park London Underground (Piccadilly, Jubilee and Victoria lines).<br><br>A one off reference and admin fee will be applicable.<br><br>Features:<br><br> - Lift<br> - New Furniture<br> - Wood Floors<br> - Fully Fitted Kitchen<br> - Utility Room<br> - Very Spacious<br> - Great Location<br><br>Agent: Concept Spaces, London<br>Agent Ref: 52616_3024523");
				expect(result.latitude).toBe('51.5141');
				expect(result.longitude).toBe('-0.150395');
				expect(result.bedrooms).toBe('1');
				expect(result.images.length).toBe(6);
				expect(result.images[0].src).toBe('http://i.ebayimg.com/00/s/MjY2WDM5OQ==/$(KGrHqNHJDkFHoO32rb(BR8sK9Jrrg~~48_79.JPG');
				expect(result.images[0].thumb).toBe('http://i.ebayimg.com/00/s/MjY2WDM5OQ==/$(KGrHqNHJDkFHoO32rb(BR8sK9Jrrg~~48_78.JPG');
				done();
			});
		});
	});
});