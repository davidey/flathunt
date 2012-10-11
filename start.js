var Settings = require('./config.js');
var FlatListPageCrawler = require('./flat-list-page-crawler.js');

var flatListPageCrawler = new FlatListPageCrawler({
	jsDomOptions: Settings.jsDomOptions
});

flatListPageCrawler.crawl(Settings.startPage, function (results) {
	console.log(results);	
})