
// Modules
	var client = require('./client');
	var server = require('./server');

// Creators
	var createClient = client;
	var createServer = server;

// Export Module
	module.exports = {

		createClient : createClient,
		createServer : createServer

	};
