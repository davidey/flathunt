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

		var query = FlatModel.find({isFetched: true});
		query.sort('-date');
		query.limit(50);
		query.exec(function (err, result) {
			var dataSet = [];
			result.forEach(function (item, index) {
				var data = {
					title: item.get('title'),
					thumbnail: item.get('thumbnail'),
					link: item.get('link'),
					price: item.get('price').toString() + item.get('pricePeriod'),
					availableDate: new Date(item.get('availableDate')).toDateString(),
					sellerType: item.get('sellerType'),
					location: item.get('location'),
					bedrooms: item.get('bedrooms')
				}
				dataSet.push(data);
			});

			res.render('index', {data: dataSet});
		});
	});
};