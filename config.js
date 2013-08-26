var fs = require('fs');
var path = require('path');

var environments = {};

environments.dev = {
	startPage: 'mock/flatlist.html',
	jsDomOptions: {
		scripts: [
			__dirname + '/mock/jquery-1.8.2.min.js'
		]
	},
	persistency: {
		uri: 'mongodb://localhost/flathunt',
		options: {}
	}
};

environments.prod = {
	startPage: 'http://www.gumtree.com/flats-and-houses-for-rent/london/page9?beds=4_to_5&price=up_to_650',
	jsDomOptions: { 
		scripts: [
			'http://code.jquery.com/jquery-1.5.min.js'
		]
	},
	persistency: {
		uri: 'mongodb://localhost/flathunt',
		options: {}
	}
};

// Temporary set the test environment as the dev one
environments.test = environments.dev;
environments.test.persistency = {
	uri: 'mongodb://localhost/mocks',
	options: {
		mocks: require(path.join(__dirname, 'mock/mocks.js')),
		debug: false
	}
};

module.exports = environments;