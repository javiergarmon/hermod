
# hermod

Blazing fast communication between Node.js processes

## How to install hermod
You can install hermod using Node Package Manager (npm):
```
npm install hermod
```

## Example
### Server with one client
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

## Benchmarks
You can see benchmark results in https://github.com/javiergarmon/hermod-benchmark

## To Do List
* Round robin examples
* Limit connections for specific IPs
* send() client method
* shout() client method
* close() client method
* Authentication support
* Middleware support
