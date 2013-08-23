var Config = require('./config.js');
var Persistency = require('.persistency.js');
var Application = require('./application.js');

var settings = Config.prod;

var application = new Application({
	jsDomOptions: settings.jsDomOptions
});

var persistency = new Persistency(function () {
	application.start(settings.startPage);
});