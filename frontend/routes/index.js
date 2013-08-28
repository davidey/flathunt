var mongoose = require('mongoose');

var Config = require('../../config.js');
var Persistency = require('../../persistency.js');
var FlatModel = require('../../model.flat.js');

var settings = Config.prod;
/*
 * GET home page.
 */

exports.index = function(req, res){
	mongoose.connect(settings.persistency.uri, function (err, response) {
		if (err) {
			console.log('Error connecting to persistency! ' + settings.persistency.uri);
			return;
		}

		var query = FlatModel.find({isFetched: true});
		query.limit(2);
		// query.sort('date');
		query.exec(function (err, result) {
			var data = [];
			result.forEach(function (item, index) {
				console.log(item);
				data.push({title: item.get('description')});
			});

			res.render('index', {data: data});
		});
	});
};