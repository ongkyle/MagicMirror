const Log = require("logger");
const NodeHelper = require("node_helper");

const RecipeFetcher = function (apiKey, url, httpMethod, data, updateInterval) {
	this.reloadTimer = null;
	this.events = "";

	this.fetchFailedCallback = function () {};
	this.eventsReceivedCallback = function () {};

	this.apiKey = apiKey;
	this.data = data;
	this.url = url;
	this.updateInterval = updateInterval;
	this.httpMethod = httpMethod;

	this.fetchRecipe = function () {
		this.clearTimeout(this.reloadTimer);
		request = this.buildRequest();

		this.awaitFetch(request)
			.then((responseData) => {
				try {
					this.parse(responseData);
					this.broadcastEvents();
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
					Log.error(`Recipe-Fetcher: Error with OpenAI API request: ${error.message}`);
					Log.error(
						`Recipe-Fetcher: Error with OpenAI API request: ${JSON.stringify({
							apiKey: this.apiKey,
							data: this.data,
							url: this.url,
							updateInterval: this.updateInterval
						})}`
					);
				}
				this.fetchFailedCallback(this, error);
				this.scheduleTimer();
			});
		this.scheduleTimer();
	};

	this.buildRequest = function () {
		headers = {
			Authorization: "Bearer " + this.apiKey,
			"Content-Type": "application/json",
			Accept: "application/json"
		};
		let raw = JSON.stringify(this.data);
		return {
			method: this.httpMethod,
			headers: headers,
			body: raw,
			redirect: "follow"
		};
	};

	this.parse = function (data) {
		Log.log("Recipe-Fetcher: got data=" + JSON.stringify(data));
		this.events = data.choices[0].text;
		Log.log("Recipe-Fetcher: parsed data=" + this.events);
	};

	this.awaitFetch = async function (request) {
		Log.log(
			"Recipe-Fetcher: fetching=" +
				JSON.stringify({
					request: request,
					url: url
				})
		);
		let response = await global.fetch(this.url, request);
		let result = await response.json();
		Log.log("Recipe-Fetcher: got json=" + result);
		return result;
	};

	this.setTimeout = function (time) {
		fetcher = new RecipeFetcher(this.apiKey, this.url, this.httpMethod, this.data, this.updateInterval);
		this.reloadTimer = setTimeout(function () {
			fetcher.fetchRecipe();
		}, time);
	};

	this.clearTimeout = function (time) {
		clearTimeout(time);
	};

	this.scheduleTimer = function () {
		this.clearTimeout(this.reloadTimer);
		this.setTimeout(this.updateInterval);
	};

	this.broadcastEvents = function () {
		events = this.getEvents();
		Log.info("Recipe-Fetcher: Broadcasting " + events);
		this.eventsReceivedCallback(events);
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
