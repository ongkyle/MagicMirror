const Dalai = require("dalai");

async function request(request, cb) {
	return new Dalai("/opt/magic_mirror/dalai").request(request, cb);
}

module.exports = request;
