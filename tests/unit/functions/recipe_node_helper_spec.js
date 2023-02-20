const Helper = require("../../../modules/default/recipe/node_helper.js");

describe("Functions into recipe/node_heler.js", function () {
	beforeEach(function () {
		// load recipe.js

		recipeNodeHelper = new Helper();
	});

	describe("socketNotificationRecieved", function () {
		beforeEach(function () {
			fake = jest.fn();
			recipeNodeHelper.createFetcher = fake;
		});

		describe("when the 'ADD_RECIPE' notification is recieved", function () {
			const payload = {
				apiKey: "test",
				url: "test",
				httpMethod: "POST",
				data: "test",
				updateInterval: "test",
				id: "test"
			};

			beforeEach(function () {
				recipeNodeHelper.socketNotificationReceived("ADD_RECIPE", payload);
			});

			it("calls createFetcher", function () {
				expect(fake).toHaveBeenCalledWith(payload.apiKey, payload.url, payload.httpMethod, payload.data, payload.updateInterval, payload.id);
			});
		});
	});

	describe("createFetcher", function () {
		const expectedApiKey = "test";
		const expectedUrl = "test";
		const expectedData = "test";
		const expectedUpdateInterval = 1234;
		const expectedIdentifier = "test";
		const expectedHttpMethod = "POST";

		beforeEach(function () {
			mockInitializer = jest.fn();
			mockOnReceive = jest.fn();
			mockOnError = jest.fn();
			mockStart = jest.fn();
			recipeNodeHelper.initializeFetcher = mockInitializer;
			recipeNodeHelper.configureOnReceiveCallback = mockOnReceive;
			recipeNodeHelper.configureOnErrorCallback = mockOnError;
			recipeNodeHelper.startFetch = mockStart;

			recipeNodeHelper.createFetcher(expectedApiKey, expectedUrl, expectedHttpMethod, expectedData, expectedUpdateInterval, expectedIdentifier);
		});

		it("creates a new fetcher", function () {
			expect(mockInitializer).toHaveBeenCalledWith(expectedApiKey, expectedUrl, expectedHttpMethod, expectedData, expectedUpdateInterval);
		});

		it("sets the on success callback", function () {
			expect(mockOnReceive).toHaveBeenCalledTimes(1);
		});

		it("sets the on error callback", function () {
			expect(mockOnError).toHaveBeenCalledTimes(1);
		});

		it("starts the fetcher", function () {
			expect(mockStart).toHaveBeenCalledTimes(1);
		});
	});

	describe("broadcastEvents", function () {
		const expectedID = "test";
		const events = ["test", "testagain"];

		beforeEach(function () {
			fake = jest.fn();
			recipeNodeHelper.sendSocketNotification = fake;
			recipeNodeHelper.broadcastEvents(events, expectedID);
		});

		it("calls sendNotification", function () {
			expect(fake).toHaveBeenCalledWith("RECIPE_EVENTS", {
				id: expectedID,
				events: events
			});
		});
	});

	describe("configureOnReceiveCallback", function () {
		const expectedID = "test";

		beforeEach(function () {
			mockOnReceive = jest.fn();
			mockBroadcastEvents = jest.fn();
			recipeNodeHelper.broadcastEvents = mockBroadcastEvents;
			jest.mock("./../../../modules/default/recipe/recipefetcher.js");
			RecipeFetcher = require("./../../../modules/default/recipe/recipefetcher.js");
			RecipeFetcher.mockImplementation(() => {
				return {
					onReceive: mockOnReceive
				};
			});
			mockFetcher = new RecipeFetcher();
			recipeNodeHelper.configureOnReceiveCallback(mockFetcher, expectedID);
		});

		it("calls fetcher.onRecieve", function () {
			expect(mockOnReceive).toHaveBeenCalledTimes(1);
			expect(mockOnReceive.mock.calls[0][0]).toEqual(expect.any(Function));
			expect(mockOnReceive.mock.calls[0][0].toString().replace(/\s+/g, "")).toEqual(`events=>{this.broadcastEvents(events,identifier);}`);
		});
	});

	describe("configureOnErrorCallback", function () {
		beforeEach(function () {
			mockOnError = jest.fn();
			jest.mock("./../../../modules/default/recipe/recipefetcher.js");
			RecipeFetcher = require("./../../../modules/default/recipe/recipefetcher.js");
			RecipeFetcher.mockImplementation(() => {
				return {
					onError: mockOnError
				};
			});
			mockFetcher = new RecipeFetcher();
			recipeNodeHelper.configureOnErrorCallback(mockFetcher);
		});

		it("calls fetcher.onError", function () {
			expect(mockOnError).toHaveBeenCalledTimes(1);
			expect(mockOnError.mock.calls[0][0]).toEqual(expect.any(Function));
			expect(mockOnError.mock.calls[0][0].toString()).toMatch(new RegExp('\\(fetcher, error\\) => {$\\s+Log.error\\("Recipe Error. Could not fetch recipe: ", error\\);', "m"));
		});
	});
});
