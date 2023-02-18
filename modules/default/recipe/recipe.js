const ONE_MINUTE = 60 * 1000;

Module.register("recipe", {
	// Default module config.
	defaults: {
		text: "Recipe!",
		wrapperName: "thin xlarge bright pre-line",
		openAI: {
			data: {
				model: "text-davinci-003",
				prompt: "reccommend an asian food recipe",
				temperature: 0,
				max_tokens: 100,
				top_p: 1,
				frequency_penalty: 0.2,
				presence_penalty: 0
			},
			apiKey: "test",
			url: "https://api.openai.com/v1/completions?model=text-davinci-003"
		},
		updateInterval: 2 * ONE_MINUTE,
		animationSpeed: 2000
	},

	recipeData: "",

	socketNotificationReceived: function (notification, payload) {
		if (notification === "RECIPE_EVENTS") {
			this.recipeData = payload.events;
			this.loaded = true;
		}
		this.updateDom(this.getDefaults().animationSpeed);
	},

	addRecipe: function () {
		defaults = this.getDefaults();
		openAIConfig = this.getOpenAI();
		this.sendSocketNotification("ADD_RECIPE", {
			id: this.identifier,
			apiKey: openAIConfig.apiKey,
			url: openAIConfig.url,
			data: openAIConfig.data,
			updateInterval: defaults.updateInterval
		});
	},

	getTemplate: function () {
		return "helloworld.njk";
	},

	getTemplateData: function () {
		return this.config;
	},

	getDefaults: function () {
		return this.defaults;
	},

	getConfigOrDefaults: function () {
		defaults = this.getDefaults();
		return {
			...defaults,
			...this.config
		};
	},

	getOpenAI: function () {
		return this.getDefaults().openAI;
	},

	getDom: function () {
		return this.createRecipeWrapper();
	},

	createRecipeSpan: function () {
		const parts = this.getRecipeData().split("\n");
		const recipe = document.createElement("span");

		for (const part of parts) {
			recipe.appendChild(document.createTextNode(part));
			recipe.appendChild(document.createElement("br"));
		}
		// remove the last break
		recipe.lastElementChild.remove();
		return recipe;
	},

	createRecipeWrapper: function () {
		const wrapper = document.createElement("div");
		wrapper.className = this.defaults.wrapperName;

		recipe = this.createRecipeSpan();
		wrapper.appendChild(recipe);

		return wrapper;
	},

	getRecipeData: function () {
		return this.recipeData;
	}
});
