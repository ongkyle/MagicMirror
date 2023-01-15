const Log = require("logger");
const openAIApi = require("openai-api");

/**
 *
 * @param {string} url The url of the calendar to fetch
 * @param {number} reloadInterval Time in ms the calendar is fetched again
 * @param {string[]} excludedEvents An array of words / phrases from event titles that will be excluded from being shown.
 * @param {number} maximumEntries The maximum number of events fetched.
 * @param {number} maximumNumberOfDays The maximum number of days an event should be in the future.
 * @param {object} auth The object containing options for authentication against the calendar.
 * @param {boolean} includePastEvents If true events from the past maximumNumberOfDays will be fetched too
 * @param {boolean} selfSignedCert If true, the server certificate is not verified against the list of supplied CAs.
 * @param apiKey
 * @param params
 * @class
 */
const RecipeFetcher = function (apiKey, params, updateInterval) {
	let reloadTimer = null;
	let events = "";

	let fetchFailedCallback = function () {};
	let eventsReceivedCallback = function () {};

	/**
	 * Initiates calendar fetch.
	 */
	const fetchRecipe = () => {
		clearTimeout(reloadTimer);
		reloadTimer = null;

		try {
			awaitCompletion()
				.then((response) => response.data)
				.then((responseData) => {
					try {
						events = responseData.choices[0].text;
						Log.log("Recipe-Fetcher: parsed data=" + events);
						Log.log("Recipe-Fetcher: got responseData=" + JSON.stringify(responseData));
					} catch (error) {
						fetchFailedCallback(this, error);
						scheduleTimer();
					}
					this.broadcastEvents();
					scheduleTimer();
				});
		} catch (error) {
			if (error.response) {
				Log.error(error.response.status, error.response.data);
			} else {
				Log.error(`Error with OpenAI API request: ${error.message}`);
			}
			fetchFailedCallback(this, error);
			scheduleTimer();
		}
		this.broadcastEvents();
		scheduleTimer();
	};

	const awaitCompletion = async () => {
		let fetcher = null;
		if (fetcher === null) {
			fetcher = openAIApi(apiKey);
		}
		return fetcher.createCompletion(params);
	};

	/**
	 * Schedule the timer for the next update.
	 */
	const scheduleTimer = function () {
		clearTimeout(reloadTimer);
		reloadTimer = setTimeout(function () {
			fetchRecipe();
		}, updateInterval);
	};

	/* public methods */

	/**
	 * Initiate fetchCalendar();
	 */
	this.startFetch = function () {
		fetchRecipe();
	};

	/**
	 * Broadcast the existing events.
	 */
	this.broadcastEvents = function () {
		Log.info("Recipe-Fetcher: Broadcasting " + events);
		eventsReceivedCallback(this);
	};

	/**
	 * Sets the on success callback
	 *
	 * @param {Function} callback The on success callback.
	 */
	this.onReceive = function (callback) {
		eventsReceivedCallback = callback;
	};

	/**
	 * Sets the on error callback
	 *
	 * @param {Function} callback The on error callback.
	 */
	this.onError = function (callback) {
		fetchFailedCallback = callback;
	};

	/**
	 * Returns current available events for this fetcher.
	 *
	 * @returns {object[]} The current available events for this fetcher.
	 */
	this.events = function () {
		return events;
	};
};

module.exports = RecipeFetcher;
