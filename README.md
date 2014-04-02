
# hermod

Blazing fast communication between Node.js processes

## How to install hermod
You can install hermod using Node Package Manager (npm):
```
npm install hermod
```

## Features
* Supports Request/Reply communication.
* Supports Send without Reply communication.
* Supports multiple server using round robin.
* Fault tolerant: clients will reconnect to servers even if server goes down and comes back later.
* Extremely fast (disables TCP Nagle's algorithm).
* Zero dependencies on other libraries.

## Examples
### Request/Reply: Server with one client
#### Server
```js
// Modules
  var hermod = require('hermod');

// Create server
  var server = hermod.createServer( 8000 );

// Listen petitions
  server.on( 'hello', function( name, callback ){
    callback( null, 'Hi ' + name + ', I am the server' );
  });

```
#### Client
```js
// Modules
  var hermod = require('hermod');

// Create client
  var client = hermod.createClient( 8000 );

// Make a petition
  client.request( 'hello', 'John', function( error, response ){
    console.log( 'Server says', response );
  });
```

### Request/Reply: 2 server with one client (Round robin)
#### Server 1
```js
// Modules
  var hermod = require('hermod');

// Create server
  var server = hermod.createServer( 8000 );

// Listen petitions
  server.on( 'hello', function( name, callback ){
    callback( null, 'Hi ' + name + ', I am the server 1' );
  });

```
#### Server 2
```js
// Modules
  var hermod = require('hermod');

// Create server
  var server = hermod.createServer( 8001 );

// Listen petitions
  server.on( 'hello', function( name, callback ){
    callback( null, 'Hi ' + name + ', I am the server 2' );
  });

```
#### Client
```js
// Modules
  var hermod = require('hermod');

// Create client
  var client = hermod.createClient( 8000, 8001 );

// Make a petition
  client.request( 'hello', 'John', function( error, response ){
    console.log( 'Server says', response );
  });
```

### Send: Server with one client
#### Server
```js
// Modules
  var hermod = require('hermod');

// Create server
  var server = hermod.createServer( 8000 );

// Listen petitions
  server.on( 'hello', function( name ){
    console.log( 'I received a message from ' + name' );
  });

```
#### Client
```js
// Modules
  var hermod = require('hermod');

// Create client
  var client = hermod.createClient( 8000 );

// Make a petition
  client.send( 'hello', 'John' );
```

## Benchmarks
You can see benchmark results in https://github.com/javiergarmon/hermod-benchmark

## Changelog
* 0.0.4 ( 2014/04/02 ): Optimized and `send()` method support.
* 0.0.3 ( 2014/04/02 ): Optimized and better documentation.
* 0.0.2 ( 2014/04/02 ): Optimized and prevent chuncked commands.
* 0.0.1 ( 2014/03/20 ): First version.

## To Do List
* Limit connections for specific IPs
* `shout()` client method
* `close()` client method
* Authentication support
* Middleware support
