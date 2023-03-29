const ONE_MINUTE = 60 * 1000;

Module.register("recipe", {
	// Default module config.
	defaultConfig: {
		text: "Recipe!",
		wrapperName: "thin xsmall bright pre-line",
		// turn this into a schema shared by the recipe.js and recipefetcher.js
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
		return "recipe.njk";
	},

	getStyles: function () {
		return [
			"recipe_styles.css"
		]
	},

	getTemplateData: function () {
		data = this.getRecipeData();
		return {
			title: "Miso Salmon Bowl",
			events: data,
			ingredients: "Ingredients: \n\n- 2 salmon fillets (6-8 ounces each)\n- 1-2 tablespoons white miso paste\n- 2 teaspoons rice vinegar\n- 2 teaspoons honey\n- 1 teaspoon sesame oil\n- 2 cloves garlic, minced\n- 2 cloves ginger, minced\n- 2 tablespoons finely chopped scallions\n- 1 cup cooked white or brown rice\n",
			instructions: "Instructions:\n\n1. Preheat oven to 375°F. Line a baking sheet with foil and spray with non-stick cooking spray.\n\n2. Place salmon fillets onto prepared baking sheet and spread the miso paste evenly over each fillet.\n\n3. In a small bowl, combine the vinegar, honey, and sesame oil, and whisk until combined.\n\n4. Drizzle the mixture over the miso-coated salmon fillets, then sprinkle with garllic, ginger, and scallions.\n\n5. Bake the salmon for 15-20 minutes, or until it flakes easily with a fork.\n\n6. Serve each salmon fillet over ½ cup cooked white or brown rice. Add a drizzle of additional sesame oil if desired. Enjoy!",
		}
	},

	getDefaults: function () {
		return this.defaultConfig;
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
		wrapper.className = this.getDefaults().wrapperName;

		recipe = this.createRecipeSpan();
		wrapper.appendChild(recipe);

		return wrapper;
	},

	getRecipeData: function () {
		return this.recipeData;
	}
});
