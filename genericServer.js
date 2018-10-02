/*
Copyright (c) 2018 Pum Walters, HvA

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

This software is created for educational purposes and should 
never be used in a production environment

This is a REST server that listens to port 10101 and accepts server specifications, which 
are then executed to start what we call **subservers**

IMPORTANT NOTE: this server accepts and executes executable JavaScipt code. That approach 
is suitable in our context of education, but should never be used in a production 
environment.

This code imports the 'notesto' library and extends that object with several 
convenience functions. The code which defines a server is interpreted in a 
context where $ signifies that object.
	  
* POST /create accepts a JSON object which specifies a server. 
	* name, version: its name and version
	* port: the port it listens to
	* init: a function called when the subserver is started, for instance to initialise
	  variables in the $ object
	* GET: and object containing all HTTP GET handlers (which this server accepts) for 
	  each key-value the key is the HTTP endpoint and the value is the text of a function 
	  which returns the response
	* POST, PUT, PATCH, DELETE: similarly for those verbs
	* POSTS: a pseudo-verb in which the body isn't parsed to allow for encrypted data
	* The functions defining HTTP verbs are interpreted in a context where PARAMS and BODY
	  hold those values, so that e.g. PARAMS.key returns someKey for the url
	   `.../..?key=someKey`
	* by default, subservers listen to the /DELETE method to kill themselves
* GET /
	* returns the list of all running subservers
*/

var Hapi = require('hapi'),
	nocrypto = require("./nocrypto.js"),
	notesto = require("./notesto.js");

var R = {};
global.R = R;
fs = require('fs');
R.logger = fs.createWriteStream('IDSlog.txt', {'flags': 'a'});

var jsn = {};
global.jsn = jsn;
jsn.loadJsonFile = require('load-json-file');
const init = async () => {

// 

var server = new Hapi.Server({
    port: 9999,
    host: '0.0.0.0',
    routes:{ 
      cors: {
            origin: ['*'],
            additionalHeaders: ['cache-control', 'x-requested-with']
        }},
});

var servers = {};

mkObject$ = (obj) => {
	var $ = Object.assign({},notesto,nocrypto);
	Object.assign($,Function('$','"use strict";return (' + obj + ')')($))
	return $
}

(function(){
	server.route([
		{	method: 'GET',
			path: '/',
			handler: function(request, reply) {
				return servers;
			}
		},
		{
			method: 'DELETE',
			path: '/reset',
			handler: function(request, reply) {
				Object.keys(servers).forEach( key => {
					servers[key].server.stop()
					delete servers[key]
				});
				return '"Generic Server Reset"';
			}
		},
		{	method: 'POST',
			path: '/create',
			handler: function(request, reply) {
				var $ = mkObject$(request.payload);
												 $.trace(2,'Generic$Generic:1')
				if (servers.hasOwnProperty($.port)) {
					return '**ERROR** port already in use ('+$.port+')'
				}
				servers[$.port] = $;
				if (!$.hasOwnProperty('init')) $.init = (()=>{});
				$.init()
				$.server = new Hapi.Server({
					port: $.port,
					host: '0.0.0.0',
					routes:{ 
					  cors: {
							origin: ['*'],
							additionalHeaders: ['cache-control', 'x-requested-with']
						}},
				});
				['POST','GET','PUT','PATCH','DELETE','POSTS'].map((i)=>{
					if ($.hasOwnProperty(i)) {
						for (let [k,v] of Object.entries($[i])) {
							var o = {
								method: i,
								path: '/'+k,
								handler: function(request, reply) { $.trace(2,'Generic$Generic:2')
									$.BODY = request.payload; 
									$.PARAM = request.query; 
									$.PATH = request.params;
									$.REQUEST = request;
									return v($) || 'null';
								}
							}
							if (i==='POSTS') { $.trace(2,'Generic$Generic:2')
								o.method = 'POST'
								o.config = {
									payload: {
										parse: false
									}
								}
							}
							$.server.route([o])
						}
					}
				});
				$.server.route([{
					method: 'DELETE',
					path: '/',
					handler: function(request, reply) { $.trace(2,'Generic$Generic:3')
						delete servers[$.port]
						$.server.stop()
						delete $.server;
						return '"destroyed"';
					}
				}])
				const init = async () => {
					await $.server.start();
					console.log(`SubServer running at: ${$.server.info.uri}`);
				};

				process.on('unhandledRejection', (err) => {
					console.log(err);
					process.exit(1);
				});

				init();
				return `SubServer running at: ${$.server.info.uri}`;
			}
	}]);
}());

    await server.start();
    console.log(`Server running at: ${server.info.uri}`);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

init();
