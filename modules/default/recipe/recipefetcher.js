const Log = require("logger");
const NodeHelper = require("node_helper");

const RecipeFetcher = function (apiKey, url, data, updateInterval) {
	this.reloadTimer = null;
	this.events = "";

	this.fetchFailedCallback = function () {};
	this.eventsReceivedCallback = function () {};

	this.apiKey = apiKey;
	this.data = data;
	this.url = url;

	this.fetchRecipe = function () {
		this.clearTimeout(this.reloadTimer);
		request = this.buildRequest();

		this.awaitFetch(request)
			.then((responseData) => {
				try {
					this.parse(responseData);
				} catch (error) {
					this.fetchFailedCallback(this, error);
					this.scheduleTimer();
					return;
				}
			})
			.catch((error) => {
				if (error.response) {
					Log.error(error.response.status, error.response.data);
				} else {
					Log.error(`Error with OpenAI API request: ${error.message}`);
				}
				this.fetchFailedCallback(this, error);
				this.scheduleTimer();
			});

		this.broadcastEvents();
		this.scheduleTimer();
	};

	this.buildRequest = function () {
		const headers = new Headers();
		headers.append("Authorization", "Bearer " + this.apiKey);
		headers.append("Content-Type", "application/json");
		const raw = JSON.stringify(this.data);
		return {
			method: "POST",
			headers: headers,
			body: raw,
			redirect: "follow"
		};
	};

	this.parse = function (data) {
		this.events = data.choices[0].text;
		Log.log("Recipe-Fetcher: parsed data=" + events);
		Log.log("Recipe-Fetcher: got responseData=" + JSON.stringify(responseData));
	};

	this.awaitFetch = async function (request) {
		const result = await global.fetch(this.url, request);
		const response = await result.data;
		return new Promise((resolve) => {
			resolve(response);
		});
	};

	this.clearTimeout = function (time) {
		clearTimeout(time);
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
