// Count all of the links from the nodejs build page
var jsdom = require("jsdom");

var FlatDetailsPageCrawler = function FlatDetailsPageCrawler(options) {
  // Requires a libraries property
  this.options = options;
};

FlatDetailsPageCrawler.prototype.crawl = function crawl(page, callback) {
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
FlatDetailsPageCrawler.prototype.crawlEngine = function crawlEngine(window, callback) {
  var $ = window.$;
  var self = this;

  var result = {
    images: []
  };

  result.id = $('.ad-id').text();

  result.description = $('#vip-description-text').html().trim();

  var ll = $('.gallery-thumbs a.open_map').attr('data-target');
  var coordinatesRe = /center=([\-0-9\.]+)%2C([\-0-9\.]+)/g;
  var match = coordinatesRe.exec(ll);

  if (match) {
    result.latitude = match[1];
    result.longitude = match[2];
  }

  result.bedrooms = $('#vip-attributes li:nth-child(3) p').text();

  var images = $('.gallery-thumbs li a:not(.open_map)');
  images.each(function () {
    var $this = $(this);

    var image = {};

    image.src = $this.attr('data-target');
    image.thumb = $this.find('img').attr('src');

    result.images.push(image);
  });

  callback(result);
};

module.exports = FlatDetailsPageCrawler;