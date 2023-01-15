const ONE_MINUTE = 60 * 1000;

Module.register("recipe-recommend", {
	// Default module config.
	defaults: {
		text: "Recipe Recommend!",
		openAI: {
			params: {
				prompt: "recommend an asian food recipe",
				model: "text-davinci-003",
				temperature: 0.6,
				max_tokens: 100,
				top_p: 1,
				frequency_penalty: 0.2,
				presence_penalty: 0
			},
			apiKey: ""
		},
		updateInterval: 2 * ONE_MINUTE,
		fadeSpeed: 4000,
		animationSpeed: 2000
	},

	// getTemplate: function () {
	// 	return "recipe-recommend.njk";
	// },
	//
	// getTemplateData: function () {
	// 	return this.config;
	// }

	// openAI: null

	start: function () {
		Log.info("Starting module: " + this.name);

		this.recipeData = "";

		this.loaded = false;

		this.addRecipe();

		// setInterval(() => {
		// 	this.updateDom(this.config.fadeSpeed);
		// }, this.config.updateInterval);
	},

	addRecipe: function () {
		this.sendSocketNotification("ADD_RECIPE", {
			id: this.identifier,
			apiKey: this.config.apiKey,
			queryParams: this.config.openAI.params,
			updateInterval: this.config.updateInterval
		});
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "RECIPE_EVENTS") {
			this.recipeData = payload.events;
			this.loaded = true;
		}
		this.updateDom(this.config.animationSpeed);
	},

	getDom: function () {
		const wrapper = document.createElement("div");
		wrapper.className = this.config.classes ? this.config.classes : "thin xlarge bright pre-line";

		const parts = this.recipeData.split("\n");
		const recipe = document.createElement("span");

		for (const part of parts) {
			recipe.appendChild(document.createTextNode(part));
			recipe.appendChild(document.createElement("BR"));
		}
		// remove the last break
		recipe.lastElementChild.remove();
		wrapper.appendChild(recipe);

		return wrapper;
	}
});
