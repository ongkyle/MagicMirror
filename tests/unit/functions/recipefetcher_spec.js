const Fetcher = require("../../../modules/default/recipe/recipefetcher.js");

describe("Functions into recipe/recipefetcher .js", function () {
	const expectedApiKey = "asdfasdf";
	const expectedUrl = "https://api.openai.com/v1/completions?model=text-davinci-003";
	const expectedData = {
		model: "text-davinci-003",
		prompt: "reccommend an asian food recipe",
		temperature: 0,
		max_tokens: 100,
		top_p: 1,
		frequency_penalty: 0.2,
		presence_penalty: 0
	};
	const raw = JSON.stringify(expectedData);
	const expectedHeaders = new Headers();
	expectedHeaders.append("Authorization", "Bearer " + expectedApiKey);
	expectedHeaders.append("Content-Type", "application/json");

	const expectedRequestOptions = {
		method: "POST",
		headers: expectedHeaders,
		body: raw,
		redirect: "follow"
	};

	const expectedText = "test";
	const expectedResult = {
		ok: true,
		data: {
			id: "cmpl-6jh5C1CZrfOd1Ch7KhJuhMFCrPTvy",
			object: "text_completion",
			created: 1676348390,
			model: "text-davinci-003",
			choices: [
				{
					text: expectedText,
					index: 0,
					logprobs: null,
					finish_reason: "length"
				}
			],
			usage: {
				prompt_tokens: 9,
				completion_tokens: 100,
				total_tokens: 109
			}
		}
	};
	const expectedUpdateInterval = 100;
	const expectedReloadTimer = null;

	beforeEach(function () {
		recipeFetcher = new Fetcher(expectedApiKey, expectedUrl, expectedData, expectedUpdateInterval);
	});

	describe("fetchRecipe", function () {
		beforeEach(function () {
			awaitFetchMock = jest.fn(() => Promise.resolve(expectedResult.data));
			recipeFetcher.awaitFetch = awaitFetchMock;
			recipeFetcher.fetchRecipe();
		});
		it("parses the responseData", function () {
			expect(recipeFetcher.events).toEqual(expectedText);
		});
		afterEach(function () {
			jest.restoreAllMocks();
		});
	});

	describe("buildRequest", function () {
		beforeEach(function () {
			observed = recipeFetcher.buildRequest();
		});
		it("returns the expected requestOptions", function () {
			expect(observed).toEqual(expectedRequestOptions);
		});
	});

	describe("awaitFetch", function () {
		beforeEach(async () => {
			global.fetch = jest.fn(() => Promise.resolve(expectedResult));
			observed = await recipeFetcher.awaitFetch(expectedRequestOptions);
		});
		it("returns result.data", () => {
			expect(observed).toEqual(expectedResult.data);
		});
		it("calls fetch with the expected params", () => {
			expect(global.fetch).toHaveBeenCalledTimes(1);
			expect(global.fetch).toHaveBeenCalledWith(expectedUrl, expectedRequestOptions);
		});
		afterEach(function () {
			jest.restoreAllMocks();
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
