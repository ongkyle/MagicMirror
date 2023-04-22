const Dalai = require("dalai");

async function request(request) {
	return new Dalai().request(request, (token) => {
		return token;
	});
}

module.exports = request;
