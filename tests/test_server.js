
// Modules
	var hermod = require('../lib/hermod');

// Create server
	var server = hermod.createServer( 8000 );

// Listen petitions
	server.on( 'hello', function( name, callback ){
		
		callback( null, 'Hi ' + name + ', I am the server' );

	});
