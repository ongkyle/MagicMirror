/**
 * @jest-environment jsdom
 */
describe("Functions into modules/default/recipe/recipe.js", function () {
	Module = {};
	Module.definitions = {};
	Module.register = function (name, moduleDefinition) {
		Module.definitions[name] = moduleDefinition;
	};

	const ONE_MINUTE = 60 * 1000;
	const expectedClassName = "thin xsmall bright pre-line";

	const expectedDefaults = {
		text: "Recipe!",
		wrapperName: expectedClassName,
		openAI: {
			data: {
				model: "text-davinci-003",
				cuisine: "asian",
				temperature: 1,
				max_tokens: 300,
				top_p: 1,
				frequency_penalty: 0,
				presence_penalty: 0
			},
			apiKey: "test",
			url: "https://api.openai.com/v1/completions?model=text-davinci-003"
		},
		updateInterval: 2 * ONE_MINUTE,
		animationSpeed: 2000
	};

	const expectedConfig = {
		text: "Recipe!",
		wrapperName: expectedClassName,
		openAI: {
			data: {
				model: "text-davinci-003",
				cuisine: "italian",
				temperature: 0,
				max_tokens: 99,
				top_p: 0.5,
				frequency_penalty: 0.2,
				presence_penalty: 0
			},
			apiKey: "test",
			url: "https://api.openai.com/v1/completions?model=text-davinci-003"
		},
		updateInterval: 3 * ONE_MINUTE,
		animationSpeed: 1000
	};

	beforeAll(function () {
		// load recipe.js
		const recipeModule = require("../../../modules/default/recipe/recipe.js");
	});

	describe("getDefaults", function () {
		it("sets the expected defaults", function () {
			expect(Module.definitions.recipe.getDefaults()).toEqual(expectedDefaults);
		});
	});

	describe("getDom", function () {
		var returnVal;

		beforeEach(function () {
			Module.definitions.recipe.recipeData = "test\nrecipe";
			returnVal = Module.definitions.recipe.getDom();
			expect(returnVal).not.toBeNull();
		});
		it("creates a div with name: " + expectedClassName, function () {
			expect(returnVal).toBeInstanceOf(HTMLDivElement);
			expect(returnVal.className).toEqual(expectedClassName);
		});

		it("creates a span nested in the div", function () {
			expect(returnVal.childNodes).toHaveLength(1);
			expect(returnVal.lastChild).toBeInstanceOf(HTMLSpanElement);
		});

		it("adds the recipe line-by-line to the span", function () {
			expect(returnVal.lastChild).not.toBeNull();
			recipeSpan = returnVal.lastChild;
			expect(recipeSpan.childNodes).toBeInstanceOf(NodeList);
			expect(recipeSpan.childNodes).toHaveLength(3);
			expectedEntries = [Text, HTMLBRElement, Text];
			expectRecipeSpanToHave(expectedEntries);

			function expectRecipeSpanToHave(entries) {
				expect(recipeSpan.childNodes.entries()).not.toBeNull();
				entries = recipeSpan.childNodes.entries();
				entry = entries.next();
				i = 0;
				while (!entry.done) {
					expect(entry.value).toHaveLength(2);
					expect(entry.value[1]).toBeInstanceOf(expectedEntries[i]);
					i = ++i;
					entry = entries.next();
				}
			}
		});
	});

	describe("addRecipe", function () {
		beforeEach(function () {
			mock = jest.fn();
			Module.definitions.recipe.sendSocketNotification = mock;
			Module.definitions.recipe.addRecipe();
		});
		it("calls sendSocketNotification", function () {
			expect(mock).toHaveBeenCalledTimes(1);
			expect(mock).toHaveBeenCalledWith("ADD_RECIPE", {
				id: undefined,
				apiKey: expectedDefaults.openAI.apiKey,
				url: expectedDefaults.openAI.url,
				data: expectedDefaults.openAI.data,
				updateInterval: expectedDefaults.updateInterval
			});
		});
		afterEach(function () {
			jest.restoreAllMocks();
		});
	});

	describe("getOpenAI", function () {
		beforeEach(function () {
			observed = Module.definitions.recipe.getOpenAI();
		});
		it("returns openAI", function () {
			expect(observed).toEqual(expectedDefaults.openAI);
		});
	});

	describe("socketNotificationReceived", function () {
		expectedNotification = "RECIPE_EVENTS";
		expectedPayload = { events: "test" };

		beforeEach(function () {
			updateDomMock = jest.fn();
			Module.definitions.recipe.updateDom = updateDomMock;
			Module.definitions.recipe.socketNotificationReceived(expectedNotification, expectedPayload);
		});

		it("sets recipeData", function () {
			expect(Module.definitions.recipe.recipeData).toEqual(expectedPayload.events);
			expect(Module.definitions.recipe.loaded).toEqual(true);
		});

		it("calls updateDom", function () {
			expect(updateDomMock).toHaveBeenCalledTimes(1);
			expect(updateDomMock).toHaveBeenCalledWith(expectedDefaults.animationSpeed);
		});

		afterEach(function () {
			jest.restoreAllMocks();
		});
	});

	describe("getConfig", function () {
		describe("when the config overwrites all defaults", function () {
			beforeEach(function () {
				Module.definitions.recipe.config = expectedConfig;
				observed = Module.definitions.recipe.getConfig();
			});
			it("returns the config", function () {
				expect(observed).toEqual(expectedConfig);
			});
			afterEach(function () {
				Module.definitions.recipe.config = undefined;
			});
		});
		describe("when there is no config", function () {
			beforeEach(function () {
				observed = Module.definitions.recipe.getConfig();
			});
			it("returns the defaults", function () {
				expect(observed).toEqual(expectedDefaults);
			});
		});
		describe("when the config overwrites some of the defaults", function () {
			beforeEach(function () {
				Module.definitions.recipe.config = {
					openAI: {
						data: {
							prompt: "reccommend an italian food recipe",
							temperature: 0,
							max_tokens: 99,
							top_p: 0.5,
							frequency_penalty: 0.2,
							presence_penalty: 0
						}
					},
					updateInterval: 3 * ONE_MINUTE,
					animationSpeed: 1000
				};
				observed = Module.definitions.recipe.getConfig();
			});
			it("returns a combination of the config and defaults", function () {
				expect(observed).toEqual({
					...expectedDefaults,
					...Module.definitions.recipe.config
				});
			});
		});

		afterEach(function () {
			jest.restoreAllMocks();
		});
	});
});
