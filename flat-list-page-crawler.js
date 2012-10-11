// Count all of the links from the nodejs build page
var jsdom = require("jsdom");

var FlatListPageCrawler = function FlatListPageCrawler(options) {
  // Requires a libraries property
  this.options = options;
};

FlatListPageCrawler.prototype.crawl = function crawl(page, callback) {
  jsdom.env({
    html: page,
    scripts: this.options.jsDomOptions.scripts,
    src: this.options.jsDomOptions.src,
    done: function (errors, window) {
      this.crawlEngine(window, callback);
    }.bind(this)
  });
};

FlatListPageCrawler.prototype.crawlEngine = function crawlEngine(window, callback) {
  $ = window.$;
  var results = [];
  var links = $('#search-results ul.ad-listings li');
  links.each(function () {
    var $this = $(this);
    var entry = {};
    entry.id = $this.find('a').attr('id').match(/([0-9]+)/g)[0];
    entry.title = $this.find('a').attr('title');
    entry.date = $this.find('span.post-date').attr('title');
    entry.price = $this.find('span.price').text().match(/[0-9]+/g)[0];
    entry.link = $this.find('a').attr('href');
    //console.log(entry);
    results.push(entry);
  });

  window.close();
  callback(results);
};

module.exports = FlatListPageCrawler;