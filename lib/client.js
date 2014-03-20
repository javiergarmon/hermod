
// Modules
	var net = require('net');

// Export Module
	module.exports = function(){

		// Variables
		var clientId   = 0;
		var clientKeys = [];
		var client     = {};
		var round      = -1;
		var counter    = 0;
		var operations = {};
		var result     = {};

		// Local functions
		var addServer = function( port ){

			net.Socket()
			   .connect( port )
			   .on( 'connect', connectedServer )
			   .on( 'data', doOperations )
			   .on( 'error', noop )
			   .on( 'close', function(){

			   		delete client[ this.hermodId ];

					clientKeys = Object.keys( client );

					this.connect( port );

			   });

		};

		var connectedServer = function(){

			this.hermodId           = clientId++;
			client[ this.hermodId ] = this;
			clientKeys              = Object.keys( client );

		};

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

		var getClient = function( callback ){

			round = ++round % clientKeys.length || 0;

			if( client[ clientKeys[ round ] ] ){
				callback( client[ clientKeys[ round ] ] );
				return;
			}

			setTimeout( function(){
				getClient( callback );
			}, 0 );

		};

		var noop = function(){};

		// Connect with the servers and listen events
		for( var i in arguments ){
			addServer( arguments[ i ] );
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

				getClient( function( client ){
					client.write( JSON.stringify( args ) + '\n' );
				});

				return result;

			}

		};

		return result;

	};
