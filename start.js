var Config = require('./config.js');
var FlatListPageCrawler = require('./flat-list-page-crawler.js');
var FlatDataManager = require('./flat-data-manager.js');

var Settings = Config.dev;

var flats = [];

var flatListPageCrawler = new FlatListPageCrawler({
	jsDomOptions: Settings.jsDomOptions
});

var flatDataManager = new FlatDataManager({}, function() {

	flatListPageCrawler.crawl(Settings.startPage, function (results) {
		flats = results;	

		flats.forEach(function (elem) {
			flatDataManager.flatExists(elem.id, function(err, res) {
				if (res) {
					console.log("Flat already there!");
					return;
				}
				console.log("Saving flat");
				flatDataManager.saveFlat(elem);
			}.bind(this));
		});
	})

});
