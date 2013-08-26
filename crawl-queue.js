var _ = require('underscore');

var CrawlQueue = function CrawlQueue(options) {
  this.defaultOptions = {
    baseInterval: 10000,
    intervalMargin: 2500,
    waitNewJobInterval: 1000
  }

  this.options = _.extend(this.defaultOptions, options);

  this.queue = [];
  this.isRunning = false;
  this.crawlNextTimeout = false;
};

CrawlQueue.prototype.enqueue = function crawl(id, uri, crawlEngine, onDone) {
  this.queue.push({
    id: id,
    uri: uri,
    crawlEngine: crawlEngine,
    onDone: onDone
  });

  console.log('Queued URI ' + uri + ', queue length: ' + this.getLength());
};

CrawlQueue.prototype.run = function run() {
  this.isRunning = true;

  var onDone = function onDone(result) {
    var nextInterval = 0;

    if (result === false) {
      // No job executed, let's wait for a new one
      nextInterval = this.options.waitNewJobInterval;
    } else {
      // A proper result
      nextInterval = this.generateInterval();
    } 
    console.log('Scheduling next job in ' + nextInterval);
    this.scheduleNextCrawl(nextInterval, onDone);
  }.bind(this);

  this.crawlNext(onDone);
};

CrawlQueue.prototype.stop = function stop() {
  this.isRunning = false;
  clearTimeout(this.crawlNextTimeout);
  this.crawlNextTimeout = false;
};

CrawlQueue.prototype.crawlNext = function crawlNext(onDone) {
  if (this.getLength() > 0) {
    var currentJob = this.queue.pop();
    var crawlEngine = currentJob.crawlEngine;

    console.log('Crawling ' + currentJob.uri);

    crawlEngine.crawl(currentJob.uri, function (result) {
      currentJob.onDone(result);
      onDone(result);
    });
  } else {
    onDone(false);
  }
};

CrawlQueue.prototype.scheduleNextCrawl = function scheduleNextCrawl(interval, onDone) {
  this.crawlNextTimeout = setTimeout(function () {
    this.crawlNext(onDone.bind(this));
  }.bind(this), interval); 
}

CrawlQueue.prototype.getLength = function getLength() {
  var result = this.queue.length;
  return result;
};


CrawlQueue.prototype.generateInterval = function generateInterval() {
  var result = this.options.baseInterval + (Math.random() * this.options.intervalMargin * 2 - this.options.intervalMargin);
  return result;
}



module.exports = CrawlQueue;