var mongoose = require('mongoose');
var async = require('async');

var Config = require('../../config.js');
var Persistency = require('../../persistency.js');
var FlatModel = require('../../model.flat.js');

var settings = Config.prod;
/*
 * GET home page.
 */

exports.index = function(req, res){
	mongoose.disconnect();
	mongoose.connect(settings.persistency.uri, function (err, response) {
		if (err) {
			console.log('Error connecting to persistency! ' + settings.persistency.uri);
			return;
		}

		var pagination = {};
		pagination.pageSize = 10;
		pagination.currentPage = parseInt(req.params.page) || 1;

		var criteria = {isFetched: true, price: {$gte: 450}, availableDate: {$gte: new Date(1379203200000)}};

		async.parallel([
			function retrieveCount(callback) {
				FlatModel.count(criteria, callback);
			}.bind(this),

			function retrieveItems(callback) {
				var query = FlatModel.find(criteria);
				query.sort('-date');
				query.limit(pagination.pageSize);
				query.skip(pagination.pageSize * (pagination.currentPage - 1));
				query.exec(callback);
			}.bind(this)
		],	function (err, resultSet) {
			var retrieveCountResult = resultSet[0];
			var retrieveItemsResult = resultSet[1];

			var itemsCount = retrieveCountResult || 0;

			pagination.totalPages = Math.ceil(retrieveCountResult / pagination.pageSize);
			pagination.pages = [];
			for (var i = 0, l = pagination.totalPages; i < l; i++) {
				var value = i + 1;
				pagination.pages.push({
					value: value,
					isSelected: value === pagination.currentPage
					});
			}
			pagination.previousPage = pagination.currentPage === 1? null : pagination.currentPage - 1;
			pagination.nextPage = pagination.currentPage === pagination.totalPages? null : pagination.currentPage + 1;

			var dataSet = [];
			retrieveItemsResult.forEach(function (item, index) {
				var images = item.get('images');
				var image = images.length > 0? images[0].src : item.get('thumbnail');
				var data = {
					title: item.get('title'),
					thumbnail: image,
					link: item.get('link'),
					price: item.get('price').toString() + item.get('pricePeriod'),
					addedDate: new Date(item.get('date')).toString(),
					availableDate: new Date(item.get('availableDate')).toDateString(),
					isAgent: item.get('sellerType') === 'Agency',
					location: item.get('location'),
					bedrooms: item.get('bedrooms')
				}
				dataSet.push(data);
			});

			res.render('index', {data: dataSet, pagination: pagination});
		}.bind(this));
	});
};


exports.map = function(req, res){
	mongoose.disconnect();
	mongoose.connect(settings.persistency.uri, function (err, response) {
		if (err) {
			console.log('Error connecting to persistency! ' + settings.persistency.uri);
			return;
		}

		var query = FlatModel.find({isFetched: true, latitude: {$ne: null}, longitude: {$ne: null}});
		query.sort('-date');
		query.limit(500);
		query.exec(function (err, result) {
			var markerSet = [];
			result.forEach(function (item, index) {
				var images = item.get('images');
				var image = images.length > 0? images[0].src : item.get('thumbnail');

				var marker = {
					latitude: item.get('latitude'),
					longitude: item.get('longitude'),
					title: item.get('title'),
					thumbnail: image,
					link: item.get('link'),
					price: item.get('price').toString() + item.get('pricePeriod'),
					availableDate: new Date(item.get('availableDate')).toDateString()
				};

				markerSet.push(marker);
			});

			res.render('map', {data: markerSet});
		});
	});
};
