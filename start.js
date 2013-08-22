var Config = require('./config.js');
var Application = require('./application.js');

var settings = Config.prod;

var application = new Application({
	jsDomOptions: settings.jsDomOptions
});

application.start(settings.startPage);