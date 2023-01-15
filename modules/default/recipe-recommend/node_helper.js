const NodeHelper = require("node_helper");
const RecipeFetcher = require("./recipefetcher.js");
const Log = require("logger");

module.exports = NodeHelper.create({
	start: function () {
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
		fetcher = new RecipeFetcher(apiKey, params, updateInterval);

		fetcher.onReceive((fetcher) => {
			this.broadcastEvents(fetcher, identifier);
		});

		fetcher.onError((fetcher, error) => {
			Log.error("Recipe Error. Could not fetch recipe: ", error);
			// let error_type = NodeHelper.checkFetchError(error);
			// this.sendSocketNotification("RECIPE_ERROR", {
			// 	id: identifier,
			// });
		});
		fetcher.startFetch();
	},

	broadcastEvents: function (fetcher, identifier) {
		this.sendSocketNotification("RECIPE_EVENTS", {
			id: identifier,
			events: fetcher.events()
		});
	}
});
