require('./flat-list-page-crawler.js')

var flatListPageCrawler = new FlatListPageCrawler();
flatListPageCrawler.crawl("http://www.gumtree.com/flats-and-houses-for-rent-offered/london", function (results) {
	console.log(results);	
})