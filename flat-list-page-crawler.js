// Count all of the links from the nodejs build page
var jsdom = require("jsdom");

var FlatListPageCrawler = function FlatListPageCrawler(options) {
  // Requires a libraries property
  this.options = options;
};

FlatListPageCrawler.prototype.crawl = function crawl(page, callback) {
  jsdom.env(
    page,
    this.options.jsDomOptions.scripts,
    function (errors, window) {
      this.crawlEngine(window, callback);
    }.bind(this)
  );
};

/**
 * Crawl engine for the given window object
 * @returns The page crawled properies: {items: Array, nextPageLink: String}
 */
FlatListPageCrawler.prototype.crawlEngine = function crawlEngine(window, callback) {
  $ = window.$;

  var results = {
    items: [],
    nextPageLink: null
  };

  var items = $('#search-results ul.ad-listings li.hlisting');
  items.each(function () {
    var $this = $(this);
    var entry = {};
    entry.id = $this.find('a').attr('id').match(/([0-9]+)/g)[0];
    entry.title = $this.find('a').attr('title');
    entry.date = new Date($this.find('span.post-date').attr('title'));
    entry.price = $this.find('span.price').text().match(/[0-9]+/g)[0];
    entry.link = $this.find('a').attr('href');
    //console.log(entry);
    results.items.push(entry);
  });

  var nextPageLink = $('#pagination li.pag-next a').attr('href');
  results.nextPageLink = nextPageLink;

  window.close();
  callback(results);
};

module.exports = FlatListPageCrawler;