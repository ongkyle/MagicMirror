const Log = require("logger");

const RecipeFetcher = function (apiKey, params, updateInterval) {
	this.reloadTimer = null;
	this.events = "";

	this.fetchFailedCallback = function () {};
	this.eventsReceivedCallback = function () {};

	this.fetcher = null;
	this.apiKey = apiKey;
	this.params = params;

	/**
	 * Initiates calendar fetch.
	 */
	// const fetchRecipe = () => {
	// 	clearTimeout(reloadTimer);
	// 	reloadTimer = null;

	// 	try {
	// 		awaitCompletion()
	// 			.then((response) => response.data)
	// 			.then((responseData) => {
	// 				try {
	// 					events = responseData.choices[0].text;
	// 					Log.log("Recipe-Fetcher: parsed data=" + events);
	// 					Log.log("Recipe-Fetcher: got responseData=" + JSON.stringify(responseData));
	// 				} catch (error) {
	// 					fetchFailedCallback(this, error);
	// 					scheduleTimer();
	// 				}
	// 				this.broadcastEvents();
	// 				scheduleTimer();
	// 			});
	// 	} catch (error) {
	// 		if (error.response) {
	// 			ta;
	// 			Log.error(error.response.status, error.response.data);
	// 		} else {
	// 			Log.error(`Error with OpenAI API request: ${error.message}`);
	// 		}
	// 		fetchFailedCallback(this, error);
	// 		scheduleTimer();
	// 	}
	// 	this.broadcastEvents();
	// 	scheduleTimer();
	// };

	this.initFetcher = function () {
		if (this.fetcher === null) {
			this.fetcher = global.fetch(this.apiKey, this.params);
		}
	};

	this.clearTimeout = function (time) {
		this.clearTimeout(time);
	};

	this.setTimeout = function (time) {
		this.reloadTimer = setTimeout(function () {
			fetchRecipe();
		}, time);
	};

	this.scheduleTimer = function () {
		this.clearTimeout(this.reloadTimer);
		this.setTimeout(updateInterval);
	};

	this.startFetch = function () {
		this.fetchRecipe();
	};

	this.broadcastEvents = function () {
		Log.info("Recipe-Fetcher: Broadcasting " + this.events);
		this.eventsReceivedCallback(this);
	};

	this.onReceive = function (callback) {
		this.eventsReceivedCallback = callback;
	};

	this.onError = function (callback) {
		this.fetchFailedCallback = callback;
	};

	this.getEvents = function () {
		return this.events;
	};
};

module.exports = RecipeFetcher;
