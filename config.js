var fs = require("fs");

var environments = {
	dev: {
		startPage: 'mock/flatlist.html',
		jsDomOptions: {
			scripts: [
				'./jquery-1.8.2.min.js'
			]
		}
	},
	prod: {
		startPage: 'http://www.gumtree.com/flats-and-houses-for-rent-offered/london',
		jsDomOptions: { 
			scripts: [
				'http://code.jquery.com/jquery-1.5.min.js'
			]
		}
	}
}

module.exports = environments;