
// Modules
	var net = require('net');

// Export module
	module.exports = function( port ){

		// Variables
		var operations = {};
		var result     = {};
		var server     = null;

		// Create server
		var server = net.createServer( function( socket ){

			// Local functions
			var doOperations = function( data ){

				data = data.toString().split('\n').slice( 0, -1 );
				
				for( var i = 0, j = data.length; i < j; i++ ){

					if( data[ i ].length ){
						executeOperation( JSON.parse( data[ i ] ) );
					}

				}

			};

			var endOfOperation = function( args, cbId ){

				args = Array.prototype.slice.call( args, 0 );
				
				args.unshift( cbId );

				socket.write( JSON.stringify( args ) + '\n' );

			};

			var executeOperation = function( data ){

				var name = data.shift();
		    	var cbId = data.pop();

		    	if( operations[ name ] ){

		    		data.push( function(){
		    			endOfOperation( arguments, cbId );
		    		});

		    		operations[ name ].apply( null, data );

		    	}

			};

			// Listen Events
		    socket.on( 'data', doOperations );

		});

		server.listen( port );

		result = {

			on : function( event, callback ){

				operations[ event ] = callback;
	
				return result;

			}

		};

		return result;

	};
