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
    entry.date = $this.find('div.ad-features span.dtlisted').attr('title');

    var price =  $this.find('span.price').text();
    var priceRe = /([0-9]+)([A-z]*)/gi;
    var priceMatch = priceRe.exec(price);

    entry.price = priceMatch[1];
    entry.pricePeriod = priceMatch[2];

    entry.link = $this.find('a').attr('href');
    entry.thumbnail = $this.find('img.thumbnail').attr('src');

    entry.sellerType = '';
    var $sellerType = $this.find('div.ad-features span.seller-type');
    if ($sellerType.length > 0) {
      entry.sellerType = $sellerType.text();
    }

    entry.location = $this.find('div.location-and-date span.location').text();
    entry.availableDate = $this.find('div.location-and-date span.displayed-date').text();

    console.log('Found flat id ' + entry.id);

    // Sanitize
    if (!entry.date) {
      console.log('Skipping ' + entry.id + ', missing date');
      return;
    }

    results.items.push(entry);
  });

  var nextPageLink = $('#pagination li.pag-next a').attr('href');
  results.nextPageLink = nextPageLink;

  window.close();
  callback(results);
};

module.exports = FlatListPageCrawler;