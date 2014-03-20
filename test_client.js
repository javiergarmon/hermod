
// Modules
	var hermod = require('./main');

// Create client
	var client = hermod.createClient( 8000, 8001, 8002, 8003 );

// Listen petitions
	
	var counter = 0;
	var resEnd  = 0;

	setInterval( function(){

		client.request( 'hello', 'John #'+(counter++), function( error, res ){
			resEnd++;
			//console.log( 'Server sais', res );
		});

	}, 0 );

	setInterval( function(){
		console.log( resEnd, new Date() );
		resEnd = 0;
	}, 1000 );
