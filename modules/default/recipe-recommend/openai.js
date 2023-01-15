/* global Class */

// const openai = require("openai");

const OpenAI = Class.extend({
	defaults: {},
	config: null,
	delegate: null,

	init: function (config) {
		this.config = config;
		Log.info(`OpenAI initialized.`);
	},

	start: function () {
		Log.info(`OpenAI started.`);
	},

	setConfig: function (config) {
		this.config = config;
		Log.info(`OpenAI config set.`, this.config);
	}
});

OpenAI.initialize = function (providerIdentifier, delegate) {
	providerIdentifier = providerIdentifier.toLowerCase();

	const openAI = new OpenAI();
	const config = Object.assign({}, openAI.defaults, delegate.config);

	openAI.delegate = delegate;
	openAI.setConfig(config);

	return openAI;
};
