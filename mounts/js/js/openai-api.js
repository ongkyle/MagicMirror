const { Configuration, OpenAIApi } = require("openai");

/**
 *
 * @param apiKey
 */
function openaiApi(apiKey) {
	const configuration = new Configuration({
		apiKey: apiKey
	});
	return new OpenAIApi(configuration);
}

module.exports = openaiApi;
