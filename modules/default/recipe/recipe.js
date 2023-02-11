/* MagicMirror²
 * Module: HelloWorld
 *
 * By Michael Teeuw https://michaelteeuw.nl
 * MIT Licensed.
 */
Module.register("recipe", {
	// Default module config.
	defaults: {
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
	},

	recipeData: "",

	getTemplate: function () {
		return "helloworld.njk";
	},

	getTemplateData: function () {
		return this.config;
	},

	getDefaults: function () {
		return this.defaults;
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
