const NodeHelper = require("node_helper");
const RecipeFetcher = require("./recipefetcher.js");
const Log = require("logger");

module.exports = NodeHelper.create({
	start() {
		Log.log("Starting node helper for: " + this.name);
		this.fetchers = [];
	},

	socketNotificationReceived: function (notification, payload) {
		if (notification === "ADD_RECIPE") {
			this.createFetcher(payload.apiKey, payload.queryParams, payload.updateInterval, payload.id);
		}
	},

	createFetcher: function (apiKey, params, updateInterval, identifier) {
		let fetcher;

		Log.log("Create new recipeFetcher.");
		fetcher = this.initializeFetcher(apiKey, params, updateInterval);

		this.configureOnReceiveCallback(fetcher, identifier);
		this.configureOnErrorCallback(fetcher);
		this.startFetch(fetcher);
	},

	broadcastEvents: function (events, identifier) {
		this.sendSocketNotification("RECIPE_EVENTS", {
			id: identifier,
			events: events
		});
	},

	initializeFetcher: function (apiKey, params, updateInterval) {
		return new RecipeFetcher(apiKey, params, updateInterval);
	},

	configureOnReceiveCallback(fetcher, identifier) {
		fetcher.onReceive((fetcher) => {
			this.broadcastEvents(fetcher, identifier);
		});
	},

	configureOnErrorCallback(fetcher) {
		fetcher.onError((fetcher, error) => {
			Log.error("Recipe Error. Could not fetch recipe: ", error);
		});
	},

	startFetch(fetcher) {
		fetcher.startFetch();
	}
});
