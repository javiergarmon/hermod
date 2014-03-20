
// Modules
	var net = require('net');

// Export Module
	module.exports = function(){

		// Variables
		var client     = [];
		var round      = -1;
		var counter    = 0;
		var operations = {};
		var result     = {};

		// Local functions
		var doOperations = function( data ){

			data = data.toString().split('\n').slice( 0, -1 );
			
			for( var i = 0, j = data.length; i < j; i++ ){

				if( data[ i ].length ){
					executeOperation( JSON.parse( data[ i ] ) );
				}

			}

		};

		var executeOperation = function( data ){
			
			var cbId = data.shift();

			if( operations[ cbId ] ){

				operations[ cbId ].apply( null, data );

				delete operations[ cbId ];

			}

		};

		var getClient = function(){

			round = ++round % client.length;

			return client[ round ];

		};

		// Connect with the servers and listen events
		for( var i in arguments ){

			var tmp = net.Socket();

			tmp.connect( arguments[ i ] )
			tmp.on( 'data', doOperations );

			client.push( tmp );

		}

		result = {

			request : function(){

				var args = Array.prototype.slice.call( arguments, 0 );
				var cbId = 0;

				if( typeof args[ args.length - 1 ] === 'function' ){

					cbId               = ++counter;
					operations[ cbId ] = args[ args.length - 1 ];

				}

				args[ args.length - 1 ] = cbId;

				getClient().write( JSON.stringify( args ) + '\n' );

				return result;

			}

		};

		return result;

	};
