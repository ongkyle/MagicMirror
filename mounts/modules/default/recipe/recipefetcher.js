const Log = require("logger");
const NodeHelper = require("node_helper");
const Llama = require("llama");

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
		// headers = {
		// 	Authorization: "Bearer " + this.apiKey,
		// 	"Content-Type": "application/json",
		// 	Accept: "application/json"
		// };
		// req = {
		// 	method: this.httpMethod,
		// 	headers: headers,
		// 	redirect: "follow"
		// };
		// if (this.httpMethod == "POST") {
		// 	data = this.buildData();
		// 	let raw = JSON.stringify(data);
		// 	req.body = raw;
		// }
		req = {
			model: "alpaca.7B",
			prompt: `
			Below is an instruction that describes a task, paired with an input that provides further context. Write a response that appropriately completes the request.

			### Instruction:
			Suggest a recipe with instructions and an ingredient list for the given cuisine type
			
			### Input:
			Asian
			
			### Response:
			`,
			skip_end: "true"
		};
		return req;
	};

	this.buildData = function () {
		prompt = this.buildPrompt();
		return {
			model: this.data.model,
			prompt: prompt,
			temperature: this.data.temperature,
			max_tokens: this.data.max_tokens,
			top_p: this.data.top_p,
			frequency_penalty: this.data.frequency_penalty,
			presence_penalty: this.data.presence_penalty
		};
	};

	this.buildPrompt = function () {
		return `reccommend an ${this.data.cuisine} food recipe`;
	};

	this.parse = function (data) {
		Log.log("Recipe-Fetcher: got data=" + data);
		this.events = data;
		Log.log("Recipe-Fetcher: parsed data=" + this.events);
	};

	this.awaitFetch = async function (request) {
		Log.log(
			"Recipe-Fetcher: fetching=" +
				JSON.stringify({
					request: request
				})
		);
		let aggregate = "";
		let responseStarted = false;
		const responsePattern = /.*### Response:.*/g;
		let cb = (msg) => {
			if (responseStarted) {
				aggregate = aggregate.concat(msg);
			}
			Log.log("Recipe-Fetcher: got response from LLAMA=" + msg);
			if (responsePattern.test(msg)) responseStarted = true;
		};
		await Llama(request, cb);

		Log.log("Recipe-Fetcher: got aggregate from LLAMA=" + aggregate);

		return aggregate;
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
