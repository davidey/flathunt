var mongoose = require('mongoose');

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

		var query = FlatModel.find({isFetched: true, price: {$gte: 450}, availableDate: {$gte: new Date(1379203200000)}});
		query.sort('-date');
		query.limit(50);
		query.exec(function (err, result) {
			var dataSet = [];
			result.forEach(function (item, index) {
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

				console.log(item.get('sellerType'), data.isAgent);
				dataSet.push(data);
			});

			res.render('index', {data: dataSet});
		});
	});
};