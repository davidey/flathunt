var mongoose = require('mongoose');
var moment = require('moment');

var AppPropertiesModel = require('./model.app-properties.js');
var FlatListPageCrawler = require('./flat-list-page-crawler.js');
var FlatDataManager = require('./flat-data-manager.js');

var Application = function Application(options) {
	// Default options
	this.defaultOptions = {
		parseNextPageBaseDelay: 10000,
		parseNextPageMargin: 5000
	};

	this.options = options;

	this.appProperties = null;

	this.flatListPageCrawler = new FlatListPageCrawler({
		jsDomOptions: this.options.jsDomOptions
	});
};

Application.prototype.start = function start(startPage) {
	this.connectToDb(function () {
		this.flatDataManager = new FlatDataManager({});
		this.loadProperties(function () {
			console.log(this.appProperties);
			this.parse(startPage, function (result) {
					this.saveItems(result.items);
			}.bind(this));
		}.bind(this));
	}.bind(this));
};

Application.prototype.connectToDb = function connectToDb(onDone) {
	mongoose.connect('mongodb://localhost/flathunt', function (err, res) {
		if (err) {
			console.log('Error connecting to Mongo!');
			return;
		}

		onDone();
	});
}

Application.prototype.loadProperties = function loadProperties(onDone) {
	AppPropertiesModel.findOne({}, function (err, result) {
		if (result) {
			this.appProperties = result;
		} else {
			this.appProperties = AppPropertiesModel.create({}, function () {});
		}

		onDone();
	}.bind(this));
}

Application.prototype.parse = function parse(page, onCompleteCallback) {
	this.flatListPageCrawler.crawl(page, function (result) {
		onCompleteCallback(result);

		var lastItemIndex = result.items.length - 1;
		var lastItemDate = new Date(result.items[lastItemIndex].date);
		var oldestFlatFetch = this.appProperties.get('oldestFlatFetch');

		console.log('Check last item date ' + lastItemDate + ' against last fetched date ' + oldestFlatFetch);

		if (moment(oldestFlatFetch).isBefore(moment(lastItemDate))) {
			// Parse next page
			console.log('About to parse next page..');
			setTimeout(function () {
				this.parse(result.nextPageLink, onCompleteCallback);
			}.bind(this), this.generateParseNextPageDelay());
		}
	}.bind(this));
}

Application.prototype.saveItems = function saveItems(items) {
	items.forEach(function (item) {
		this.flatDataManager.flatExists(item.id, function(err, res) {
			if (res) {
				console.log('Flat ' + item.id + ' already there!');
				return;
			}
			console.log('Saving flat ' + item.id);
			this.flatDataManager.saveFlat(item);
		}.bind(this));
	}.bind(this));
}

Application.prototype.generateParseNextPageDelay = function generateParseNextPageDelay() {
	var result = this.options.parseNextPageBaseDelay + (Math.random() * this.options.parseNextPageMargin);
	return result;
}

module.exports = Application;