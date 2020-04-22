const path = require('path');

function getPath(...paths) {
	return path.join(__dirname, ...paths);
}

module.exports = { getPath };
