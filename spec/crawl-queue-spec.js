var Config = require('../config.js');
var CrawlQueue = require('../crawl-queue.js');

var Settings = Config.test;

describe('CrawlQueue', function () {
	'use strict';

	var crawlQueue;

	beforeEach(function () {
		crawlQueue = new CrawlQueue({
			jsDomOptions: Settings.jsDomOptions
		});
	});

	afterEach(function () {
		crawlQueue.stop();
	});

	describe('on construct', function () {
		it("should be set as not running", function() {
			var result = crawlQueue.isRunning;

			expect(result).toBeFalsy();
		});
	});

	describe('stop()', function () {
		it("should set the object as not running", function() {
			crawlQueue.stop();

			expect(crawlQueue.isRunning).toBeFalsy();
		});

		it("should clear the internal timeout", function() {
			crawlQueue.crawlNextTimeout = setTimeout(function () {}, 10000);
			crawlQueue.stop();

			expect(crawlQueue.crawlNextTimeout).toBeFalsy();
		});
	});

	describe('enqueue()', function () {
		it("should add a job to the queue", function() {
			var id = 'id';
			var uri = 'http://google.com';
			var crawlEngine = function crawlEngine() {};
			var onDone = function onDone() {};

			crawlQueue.enqueue(id, uri, crawlEngine, onDone);

			expect(crawlQueue.queue[0].id).toBe(id);
			expect(crawlQueue.queue[0].uri).toBe(uri);
			expect(crawlQueue.queue[0].crawlEngine).toBe(crawlEngine);
			expect(crawlQueue.queue[0].onDone).toBe(onDone);
		});

		it("should be incremented every time a new job is added to the queue", function() {
			var result = crawlQueue.getLength();

			expect(result).toBe(0);
		});
	});

	describe('crawlNext()', function () {
		it("should return onDone(false) if there are no jobs in queue", function() {
			var callback = jasmine.createSpy();
			crawlQueue.crawlNext(callback);

			expect(callback).toHaveBeenCalledWith(false);
		});

		it("should execute the next job", function() {
			var id = 'id';
			var uri = 'http://google.com';
			var crawlEngine = {
				crawl: function (page, onDone) {
					onDone('result');
				}
			};
			var onDone = jasmine.createSpy();
			var callback = jasmine.createSpy();
			spyOn(crawlEngine, 'crawl').andCallThrough();

			crawlQueue.enqueue(id, uri, crawlEngine, onDone);
			crawlQueue.crawlNext(callback);

			expect(onDone).toHaveBeenCalledWith('result');
			expect(callback).toHaveBeenCalledWith('result');
		});
	});

	describe('run()', function () {
		it("should keep waiting for a new job to be enqueued if none available", function() {
			var flag;

			spyOn(crawlQueue, 'scheduleNextCrawl').andCallThrough();

			runs(function () {
				crawlQueue.run();
				setTimeout(function () {
					flag = true;
				}, 2500);
			})
			

			waitsFor(function() {
				return flag;
			}, "", 3000);

			runs(function () {
				expect(crawlQueue.scheduleNextCrawl.calls.length).toBe(3);
			})
		});

		it("should set isRunning to true", function() {
			crawlQueue.run();

			expect(crawlQueue.isRunning).toBeTruthy();
		});
	});

	describe('generateInterval()', function () {
		it("should return a value between 7500 and 12500", function() {
			var result = crawlQueue.generateInterval();

			expect(result >= 7500).toBeTruthy();
			expect(result <= 12500).toBeTruthy();
		});
	});

	describe('getLength()', function () {
		it("should be 0 when the crawlQueue is initialized", function() {
			var result = crawlQueue.getLength();

			expect(result).toBe(0);
		});

		it("should be incremented every time a new job is added to the queue", function() {
			crawlQueue.enqueue('1', 'http://google.com', {}, {});
			crawlQueue.enqueue('2', 'http://yahoo.com', {}, {});

			var result = crawlQueue.getLength();

			expect(result).toBe(2);
		});
	});
});