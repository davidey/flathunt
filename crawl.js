// Count all of the links from the nodejs build page
var jsdom = require("jsdom");
var mongoose = require('mongoose'),
    db = mongoose.connect('mongodb://localhost/flathunt');

var Schema = mongoose.Schema;
var schema = new Schema({
    'id': String,
    'title': String,
    'date': String,
    'price': String,
    'link': String
});

var Flat = mongoose.model('Flat', schema);

jsdom.env("http://www.gumtree.com/flats-and-houses-for-rent-offered/london", [
  'http://code.jquery.com/jquery-1.5.min.js'
],

function(errors, window) {
  $ = window.$;
  var results = [];
  var links = $('#search-results ul.ad-listings li');
  links.each(function () {
    var entry = new Flat();
    var $this = $(this);
    entry.id = $this.find('a').attr('id').match(/([0-9]+)/g)[0];
    entry.title = $this.find('a span').text();
    entry.date = $this.find('span.post-date').attr('title');
    entry.price = $this.find('span.price').text().match(/[0-9]+/g)[0];
    entry.link = $this.find('a').attr('href');
    //console.log(entry);
    results.push(entry);

    entry.save(function (err) {
        if (err) throw err;
        console.log('saved');


        Flat.count();
    });
  });


  console.log(results.length);
});
