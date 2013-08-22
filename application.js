var mongoose = require('mongoose');
var moment = require('moment');

var AppPropertiesModel = require('./model.app-properties.js');
var FlatListPageCrawler = require('./flat-list-page-crawler.js');
var FlatDataManager = require('./flat-data-manager.js');

var Application = function Application(options) {
	// Requires a libraries property
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
		var lastItemDate = result.items[lastItemIndex].date;

		if (moment(this.appProperties.get('oldestFlatFetch')).isAfter(moment(lastItemDate))) {
			// Parse next page
			console.log('About to parse next page..');
			setTimeout(function () {
				this.parse(result.nextPageLink, onCompleteCallback);
			}.bind(this), 5000 + (Math.random() * 5000));
		}
	}.bind(this));
}

Application.prototype.saveItems = function saveItems(items) {
	items.forEach(function (item) {
		this.flatDataManager.flatExists(item.id, function(err, res) {
			if (res) {
				console.log("Flat already there!");
				return;
			}
			console.log("Saving flat");
			this.flatDataManager.saveFlat(item);
		}.bind(this));
	}.bind(this));
}

module.exports = Application;