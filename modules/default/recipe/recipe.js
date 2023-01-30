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
		openAI: {
			options: {
				method: "POST",
				hostName: "api.openai.com",
				path: "/v1/completions?model=text-davinci-003",
				contentType: "application/json"
			}
		}
	},

	getTemplate: function () {
		return "helloworld.njk";
	},

	getTemplateData: function () {
		return this.config;
	},

	getDefaults: function () {
		return this.defaults;
	}
});
