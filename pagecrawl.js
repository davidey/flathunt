// Count all of the links from the nodejs build page
var jsdom = require("jsdom");

var FlatListPageCrawler = function FlatListPageCrawler() {};

FlatListPageCrawler.prototype.crawl = function crawl(page) {
  jsdom.env("http://www.gumtree.com/flats-and-houses-for-rent-offered/london", [
    'http://code.jquery.com/jquery-1.5.min.js'
  ], this.crawlEngine);
};

FlatListPageCrawler.prototype.crawlEngine = function crawlEngine(errors, window) {
  $ = window.$;
  var results = [];
  var links = $('#search-results ul.ad-listings li');
  links.each(function () {
    var entry = {};
    entry.id = $this.find('a').attr('id').match(/([0-9]+)/g)[0];
    entry.title = $this.find('a span').text();
    entry.date = $this.find('span.post-date').attr('title');
    entry.price = $this.find('span.price').text().match(/[0-9]+/g)[0];
    entry.link = $this.find('a').attr('href');
    //console.log(entry);
    results.push(entry);
  });


  console.log(results.length);

  window.close();
  return;
};

module.exports = FlatListPageCrawler;