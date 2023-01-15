Module.register("recipe-recommend", {
	// Default module config.
	defaults: {
		text: "Recipe Recommend!"
	},

	getTemplate: function () {
		return "recipe-recommend.njk";
	},

	getTemplateData: function () {
		return this.config;
	}
});
