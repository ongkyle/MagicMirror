let config = {
	modules: [
		{
			module: "recipe",
			position: "bottom_bar",
			config: {
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
					url: "http://localhost:8080/tests/configs/data/recipe/test.json"
				}
			}
		}
	]
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
	module.exports = config;
}
