
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

                    this.cache = '';

                    clientKeys = Object.keys( client );

                    this.connect( port );

               });

        };

        var connectedServer = function(){

            this.setNoDelay( true );

            this.hermodId           = clientId++;
            this.cache              = '';
            client[ this.hermodId ] = this;
            clientKeys              = Object.keys( client );

        };

        var doOperations = function( data ){

            this.cache += data;

            while( data = getOperationFromCache.call( this ) ){
                executeOperation( data );
            }

        };

        var getOperationFromCache = function(){

            var origin = this.cache;

            var cut = this.cache.indexOf('#');

            if( cut === -1 ){
                return null;
            }

            var size   = this.cache.slice( 0, cut );
            var length = parseInt( size, 10 );

            if( this.cache.length - size.length - 1 < length ){
                return null;
            }

            this.cache = this.cache.slice( cut + 1 );

            var data = this.cache.slice( 0, length );

            this.cache = this.cache.slice( length );

            return JSON.parse( data );

        };

        var executeOperation = function( data ){
            
            var cbId = data.shift();
            var end  = data.shift();
            
            if( operations[ cbId ] ){

                if( operations[ cbId ].multi ){

                    if( end ){
                        operations[ cbId ][ 1 ].apply( null, data );
                    }else{
                        operations[ cbId ][ 0 ].apply( null, data );
                    }
                    
                }else{
                    operations[ cbId ].apply( null, data );
                }

                if( end ){
                    delete operations[ cbId ];
                }

            }

        };

        var getClient = function( callback ){

            round = ++round % clientKeys.length || 0;

            if( client[ clientKeys[ round ] ] ){
                callback( client[ clientKeys[ round ] ] );
                return;
            }

            setInmediate( function(){
                getClient( callback );
            });

        };

        var noop = function(){};

        if( typeof setInmediate === 'undefined' ){
            
            var setInmediate = function( cb ){
                return setTimeout( cb, 0 );
            };

        }

        // Connect with the servers and listen events
        for( var i in arguments ){
            addServer( arguments[ i ] );
        }

        result = {

            request : function(){

                var args = Array.prototype.slice.call( arguments, 0 );
                var cbId = 0;

                if( typeof args[ args.length - 1 ] === 'function' ){

                    cbId                    = ++counter;
                    operations[ cbId ]      = args[ args.length - 1 ];
                    args[ args.length - 1 ] = cbId;

                }else{
                    args[ args.length ] = 0;
                }

                getClient( function( client ){

                    var data = JSON.stringify( args );

                    client.write( data.length + '#' + JSON.stringify( args ) );

                });

                return result;

            },

            multiRequest : function(){

                var args = Array.prototype.slice.call( arguments, 0 );
                var cbId = 0;

                if( typeof args[ args.length - 1 ] === 'function' ){

                    cbId                     = ++counter;
                    operations[ cbId ]       = [ args[ args.length - 2 ], args[ args.length - 1 ] ];
                    operations[ cbId ].multi = true;
                    args[ args.length - 2 ]  = cbId;
                    args[ args.length - 1 ]  = true;

                }else{
                    args[ args.length ] = 0;
                }

                getClient( function( client ){

                    var data = JSON.stringify( args );

                    client.write( data.length + '#' + JSON.stringify( args ) );

                });

                return result;

            },

            send : function(){

                var args = Array.prototype.slice.call( arguments, 0 );

                args[ args.length ] = 0;

                getClient( function( client ){

                    var data = JSON.stringify( args );

                    client.write( data.length + '#' + JSON.stringify( args ) );

                });

                return result;

            }

        };

        return result;

    };
