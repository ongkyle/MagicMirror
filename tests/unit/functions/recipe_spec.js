/**
 * @jest-environment jsdom
 */
describe("Functions into modules/default/recipe/recipe.js", function () {
	Module = {};
	Module.definitions = {};
	Module.register = function (name, moduleDefinition) {
		Module.definitions[name] = moduleDefinition;
	};

	beforeAll(function () {
		// load recipe.js
		const recipeModule = require("../../../modules/default/recipe/recipe.js");
	});

	describe("getDefaults", function () {
		const expected = {
			text: "Recipe!",
			wrapperName: "thin xlarge bright pre-line",
			openAI: {
				options: {
					method: "POST",
					hostName: "api.openai.com",
					path: "/v1/completions?model=text-davinci-003",
					contentType: "application/json"
				}
			}
		};

		it("sets the expected defaults", function () {
			expect(Module.definitions.recipe.getDefaults()).toEqual(expected);
		});
	});

	describe("getDom", function () {
		const expectedClassName = "thin xlarge bright pre-line";
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
});
