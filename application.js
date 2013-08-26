var moment = require('moment');
var _ = require('underscore');

var FlatListPageCrawler = require('./flat-list-page-crawler.js');
var FlatDetailsPageCrawler = require('./flat-details-page-crawler.js');
var FlatDataManager = require('./flat-data-manager.js');
var CrawlQueue = require('./crawl-queue.js');

var Application = function Application(appProperties, options) {
	// Default options
	this.defaultOptions = {
		baseInterval: 3000,
		intervalMargin: 1500
	};

	this.options = _.extend(this.defaultOptions, options);

	this.appProperties = appProperties;

	this.flatListPageCrawler = new FlatListPageCrawler({
		jsDomOptions: this.options.jsDomOptions
	});

	this.flatDetailsPageCrawler = new FlatDetailsPageCrawler({
		jsDomOptions: this.options.jsDomOptions
	});

	this.flatDataManager = new FlatDataManager({});

	this.startDate = null;

	this.crawlQueue = new CrawlQueue({
		baseInterval: this.options.baseInterval,
		intervalMargin: this.options.intervalMargin
	});
};

Application.prototype.start = function start(startPage) {
	this.startDate = new Date();
	this.enqueueFlatList(startPage);
	this.crawlQueue.run();
};

Application.prototype.onFlatListManagerResult = function onFlatListManagerResult(result) {
	this.saveItems(result.items);

	var lastItemIndex = result.items.length - 1;
	var lastItemDate = new Date(result.items[lastItemIndex].date);
	var oldestFlatFetch = this.appProperties.get('oldestFlatFetch');

	console.log('Check last item date ' + lastItemDate + ' against last fetched date ' + oldestFlatFetch);

	if (moment(oldestFlatFetch).isBefore(moment(lastItemDate))) {
		this.enqueueFlatList(result.nextPageLink);
	} else {
		// Reached the date limit
		this.endFlatListCrawling();
	}
};

Application.prototype.endFlatListCrawling = function endFlatListCrawling() {
	this.appProperties.set('oldestFlatFetch', this.startDate);
	this.appProperties.save();

	this.crawlQueue.stop();
}

Application.prototype.saveItems = function saveItems(items) {
	var countSkipped = 0;
	var countSaved = 0;

	var countTotal = items.length;

	items.forEach(function (item, index) {
		this.flatDataManager.flatExists(item.id, function(err, res) {
			if (res) {
				countSkipped++;
			} else {
				countSaved++;
				item.availableDate = this.parseAvailableDate(item.availableDate);
				this.flatDataManager.saveFlat(item);
			}

			if (--countTotal === 0) {
				console.log('Saved ' + countSaved + ' flats, ' + countSkipped + ' skipped');
			}
		}.bind(this));
	}.bind(this));
}

Application.prototype.parseAvailableDate = function parseAvailableDate(date) {
	var result = moment(date, 'DD/MM/YY');

	if (result === null || !result.isValid()) {
		console.log('Can\'t parse available date ' + date);
		result = null;
	} else {
		result = result.toDate();
	}

	return result;
}

Application.prototype.enqueueFlatList = function enqueueFlatList(uri) {
	this.crawlQueue.enqueue('list', uri, this.flatListPageCrawler, this.onFlatListManagerResult.bind(this))
}

Application.prototype.enqueueFlatDetails = function enqueueFlatDetails(id,uri) {
	this.crawlQueue.enqueue(id, uri, this.flatDetailsPageCrawler, this.onFlatDetailsManagerResult.bind(this))
}

module.exports = Application;