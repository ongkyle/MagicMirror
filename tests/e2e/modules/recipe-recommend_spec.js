const helpers = require("../global-setup");

describe("Test recipe-recommend module", () => {
	afterAll(async () => {
		await helpers.stopApplication();
	});

	describe("recipe-recommend set config text", () => {
		beforeAll((done) => {
			helpers.startApplication("tests/configs/modules/recipe-recommend/recipe-recommend.js");
			helpers.getDocument(done);
		});

		it("Test message recipe-recommend module", (done) => {
			helpers.waitForElement(".recipe-recommend").then((elem) => {
				done();
				expect(elem).not.toBe(null);
				expect(elem.textContent).toContain("Test recipe-recommend Module");
			});
		});
	});

	describe("recipe-recommend default config text", () => {
		beforeAll((done) => {
			helpers.startApplication("tests/configs/modules/recipe-recommend/recipe-recommend_default.js");
			helpers.getDocument(done);
		});

		it("Test message recipe-recommend module", (done) => {
			helpers.waitForElement(".recipe-recommend").then((elem) => {
				done();
				expect(elem).not.toBe(null);
				expect(elem.textContent).toContain("Recipe Recommend!");
			});
		});
	});
});
