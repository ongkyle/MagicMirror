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

	start: function () {
		Log.info("Starting module: " + this.name);

		this.recipeData = "";

		this.loaded = false;

		this.addRecipe();

		// setInterval(() => {
		// 	this.updateDom(this.config.fadeSpeed);
		// }, this.config.updateInterval);
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "RECIPE_EVENTS") {
			this.recipeData = payload.events;
			this.loaded = true;
		}
		this.updateDom(this.getDefaults().animationSpeed);
	},

	addRecipe: function () {
		config = this.getConfig();
		openAIConfig = this.getOpenAI();
		this.sendSocketNotification("ADD_RECIPE", {
			apiKey: openAIConfig.apiKey,
			url: openAIConfig.url,
			httpMethod: openAIConfig.httpMethod,
			data: openAIConfig.data,
			updateInterval: config.updateInterval,
			id: this.identifier
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

	getConfig: function () {
		return {
			...this.getDefaults(),
			...this.config
		};
	},

	getOpenAI: function () {
		return this.getConfig().openAI;
	},

	getDom: function () {
		return this.createRecipeWrapper();
	},

	createRecipeSpan: function () {
		let recipeData = this.getRecipeData();
		let parts = recipeData.split("\n");
		let recipe = document.createElement("span");

		for (let part of parts) {
			recipe.appendChild(document.createTextNode(part));
			recipe.appendChild(document.createElement("br"));
		}
		// remove the last break
		recipe.lastElementChild.remove();
		return recipe;
	},

	createRecipeWrapper: function () {
		let wrapper = document.createElement("div");
		wrapper.className = this.defaults.wrapperName;

		recipe = this.createRecipeSpan();
		wrapper.appendChild(recipe);

		return wrapper;
	},

	getRecipeData: function () {
		return this.recipeData;
	}
});
