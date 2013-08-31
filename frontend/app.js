
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

var mongoose = require('mongoose');
var db = mongoose.createConnection('localhost', 'flathunt')

var Handlebars = require('express3-handlebars');

app.engine('handlebars', Handlebars({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// all environments
app.set('port', process.env.PORT || 9876);
app.set('views', __dirname + '/views');
//app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/map', routes.map);
app.get('/:page?', routes.index);
app.get('/users', user.list);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
