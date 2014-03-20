
// Modules
	var hermod = require('../lib/hermod');

// Create server
	var server = hermod.createServer( 8001 );

// Listen petitions
	server.on( 'hello', function( name, callback ){

		//console.log( name + ' sais hello!' );

		callback( null, 'Hi ' + name + ', I am the server' );

	});
