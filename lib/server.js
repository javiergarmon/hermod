
// Modules
	var net = require('net');

// Export module
	module.exports = function( port, host, restrict ){

		// Variables
		var operations		= {};
		var result			= {};
		var server			= null;
		var restrictEnabled = restrict instanceof Array && !!restrict.length;

		// Create server
		server = net.createServer( function( socket ){

			if(
				restrictEnabled &&
				restrict.indexOf( socket.remoteAddress ) === -1
			){
				socket.end();
				return;
			}

			var cache = '';

			// Local functions
			var doOperations = function( data ){

				cache += data;

				while( data = getOperationFromCache() ){
					executeOperation( data );
				}

			};

			var getOperationFromCache = function(){

				var origin = cache;

				var cut = cache.indexOf('#');

				if( cut === -1 ){
					return null;
				}

				var size   = cache.slice( 0, cut );
				var length = parseInt( size, 10 );

				if( cache.length - size.length - 1 < length ){
					return null;
				}

				cache = cache.slice( cut + 1 );

				var data = cache.slice( 0, length );

				cache = cache.slice( length );

				return JSON.parse( data );

			};

			var endOfOperation = function( args, cbId ){

				args = Array.prototype.slice.call( args, 0 );
				
				args.unshift( 1 );
				args.unshift( cbId );

				var data = JSON.stringify( args );

				socket.write( data.length + '#' + data );

			};

			var multiOperation = function( args, cbId ){

				args = Array.prototype.slice.call( args, 0 );
				
				args.unshift( 0 );
				args.unshift( cbId );

				var data = JSON.stringify( args );

				socket.write( data.length + '#' + data );

			};

			var executeOperation = function( data ){

				var name  = data.shift();
				var cbId  = data.pop();
				var multi = false;

				if( typeof cbId !== 'number' ){
					
					multi = !!cbId;
					cbId  = data.pop();

				}

				if( operations[ name ] ){

					if( multi ){
						
						data.push( function(){
							multiOperation( arguments, cbId );
						});

					}

					data.push( function(){
						endOfOperation( arguments, cbId );
					});

					operations[ name ].apply( null, data );

				}

				// To Do -> What has to happen if it is undefined?

			};

			// Listen Events
			socket.on( 'data', doOperations );

		});

		server.listen( port, host );

		result = {

			on : function( event, callback ){

				operations[ event ] = callback;
	
				return result;

			},

			onMulti : function( event, callback ){

				operations[ event ] = callback;
	
				return result;

			}

		};

		return result;

	};
