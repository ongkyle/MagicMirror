const Fetcher = require("../../../modules/default/recipe/recipefetcher.js");

describe("Functions into recipe/recipefetcher .js", function () {
	const expectedApiKey = "asdfasdf";
	const expectedParams = { test: "test" };
	const expectedUpdateInterval = 100;
	const expectedReloadTimer = null;

	beforeEach(function () {
		recipeFetcher = new Fetcher(expectedApiKey, expectedParams, expectedUpdateInterval);
	});

	describe("initFetcher", function () {
		beforeEach(function () {
			global.fetch = jest.fn();
			recipeFetcher.initFetcher();
		});
		afterEach(function () {
			global.fetch.mockRestore();
		});
		it("sets the fetcher", function () {
			expect(recipeFetcher.fetcher).not.toBe(null);
		});
		it("passes the apiKey to fetch", function () {
			expect(global.fetch).toHaveBeenCalledWith(expectedApiKey, expectedParams);
		});
	});

	describe("scheduleTimer", function () {
		beforeEach(function () {
			clearTimeoutMock = jest.fn();
			setTimeoutMock = jest.fn();
			recipeFetcher.clearTimeout = clearTimeoutMock;
			recipeFetcher.setTimeout = setTimeoutMock;
			recipeFetcher.scheduleTimer();
		});
		it("calls clearTimeout", function () {
			expect(clearTimeoutMock).toHaveBeenCalledTimes(1);
			expect(clearTimeoutMock).toHaveBeenCalledWith(expectedReloadTimer);
		});

		it("calls setTimeout", function () {
			expect(setTimeoutMock).toHaveBeenCalledTimes(1);
			expect(setTimeoutMock).toHaveBeenCalledWith(expectedUpdateInterval);
		});
	});

	describe("startFetch", function () {
		beforeEach(function () {
			mock = jest.fn();
			recipeFetcher.fetchRecipe = mock;
			recipeFetcher.startFetch();
		});
		it("calls fetchRecipe", function () {
			expect(mock).toHaveBeenCalledTimes(1);
		});
	});

	describe("broadcastEvents", function () {
		beforeEach(function () {
			mock = jest.fn();
			recipeFetcher.eventsReceivedCallback = mock;
			recipeFetcher.broadcastEvents();
		});
		it("calls eventsReceivedCallback", function () {
			expect(mock).toHaveBeenCalledTimes(1);
		});
	});

	describe("onReceive", function () {
		beforeEach(function () {
			fake = jest.fn();
			recipeFetcher.onReceive(fake);
		});
		it("sets eventsReceivedCallback", function () {
			expect(recipeFetcher.eventsReceivedCallback).not.toBe(undefined);
			expect(recipeFetcher.eventsReceivedCallback).toEqual(fake);
		});
	});

	describe("onError", function () {
		beforeEach(function () {
			fake = jest.fn();
			recipeFetcher.onError(fake);
		});
		it("sets eventsReceivedCallback", function () {
			expect(recipeFetcher.fetchFailedCallback).not.toBe(undefined);
			expect(recipeFetcher.fetchFailedCallback).toEqual(fake);
		});
	});

	describe("getEvents", function () {
		const expectedEvents = ["test", "this"];
		var observedEvents;

		beforeEach(function () {
			recipeFetcher.events = expectedEvents;
			observedEvents = recipeFetcher.getEvents();
		});
		it("sets eventsReceivedCallback", function () {
			expect(observedEvents).toEqual(expectedEvents);
		});
	});
});
