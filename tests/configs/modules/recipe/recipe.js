let config = {
	modules: [
		{
			module: "recipe",
			position: "bottom_bar",
			config: {
				openAI: {
					apiKey: "test",
					url: "http://localhost:8080/tests/configs/data/recipeTest.json",
					httpMethod: "GET"
				}
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
