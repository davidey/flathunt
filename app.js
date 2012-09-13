var mongoose = require('mongoose'),
    db = mongoose.createConnection('localhost', 'flathunt'),
    express = require('express'),
    app = express();


var schema = new mongoose.Schema({
    'id': String,
    'title': String,
    'date': String,
    'price': String,
    'link': String
});

var Flat = db.model('Flat', schema);

app.get('/', function (req, res) {
	Flat.find({}, function (err, models) {
		content = '';
		models.forEach(function (model) {
			content += models.toString();
		});
		res.send(content);
	});
});

app.listen(3000);
console.log('Listening on port 3000');