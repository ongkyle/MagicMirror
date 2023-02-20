const helpers = require("../global-setup");

describe("Test recipe module", () => {
	afterAll(async () => {
		await helpers.stopApplication();
	});

	describe("recipe module", () => {
		beforeAll((done) => {
			helpers.startApplication("tests/configs/modules/recipe/recipe.js");
			helpers.getDocument(done);
			jest.setTimeout(30000);
		});

		it("displays recipes at the configured interval", (done) => {
			ignoreVal = "";
			helpers.waitForElement(".recipe", "undefined").then((elem) => {
				done();
				expect(elem).not.toBe(null);
				expect(elem.textContent).toContain("Korean Spicy Bulgogi");
				ignoreVal = elem.textContent;
			});

			// helpers.waitForElement(".recipe", ignoreVal).then((elem) => {
			// 	done();
			// 	expect(elem).not.toBe(null);
			// 	expect(elem.textContent).toContain("Chinese Chicken Congee");
			// });
		});
	});
});
