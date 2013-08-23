var Config = require('./config.js');
var Persistency = require('./persistency.js');
var Application = require('./application.js');

var settings = Config.prod;
var application;

var persistency = new Persistency(settings.persistency.uri, {
	connectionOptions: settings.persistency.options
});

persistency.connect(function () {
	persistency.loadAppProperties(function (appProperties) {
		application = new Application(appProperties, {
			jsDomOptions: settings.jsDomOptions
		});

		application.start(settings.startPage);
	});
});