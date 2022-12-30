Module.register("recipe-recommend", {
	// Default module config.
	defaults: {
		text: "Recipe Recommend!",
	},

	// Override dom generator.
	getDom: function () {
		var wrapper = document.createElement("div");
		wrapper.innerHTML = this.config.text;
		return wrapper;
	},
});
