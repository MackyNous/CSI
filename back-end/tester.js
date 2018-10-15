var Hapi = require('hapi'),
	notesto = require("./notesto.js"),
	nocrypto = require("./nocrypto.js");

(function($){
	console.log('Test nocrypto');
	console.log('Test if genericServer is running (raises ECONNREFUSED if not)');
	$.GET('localhost:9999/')
	.then($.expect(/^{.*}$/,'Set of subservers'))

.then(()=>{ console.log('Test /create a server')
	$.POST('localhost:9999/create',
		`{	name: 'HelloWorld',
			port: 21212,
			version: 1,
			GET: {
				name: () => {
					console.log('@@@',$.REQUEST.info);
					return $.name;
				}
			}
		}`)
	.then($.expect(/^SubServer.*$/,'Start a Subserver'))
	
.then(()=>{ console.log('Test the new server')
	$.GET('localhost:21212/name')
	.then($.expect(/HelloWorld/,'It lives'))
	
.then(()=>{ console.log('Delete this server')
	$.DELETE('localhost:21212/')
	.then($.expect(/destroyed/,'Remove this server'))

.then(()=>{
	$.POST('localhost:9999/create',
		`{	name: 'HelloWorld1',
			port: 21201,
			version: 1,
			GET: {
				name: () => $.name
			}
		}`)
	.then($.expect(/^SubServer.*$/,'Start a Subserver'))

.then(()=>{
	$.POST('localhost:9999/create',
		`{	name: 'HelloWorld2',
			port: 21202,
			version: 1,
			GET: {
				name: () => $.name
			}
		}`)
	.then($.expect(/^SubServer.*$/,'Start a Subserver'))

.then(()=>{
	$.POST('localhost:9999/create',
		`{	name: 'HelloWorld3',
			port: 21203,
			version: 1,
			GET: {
				name: () => $.name
			}
		}`)
	.then($.expect(/^SubServer.*$/,'Start a Subserver'))

.then(()=>{ console.log('Test the new server1')
	$.GET('localhost:21201/name')
	.then($.expect(/HelloWorld/,'It lives1'))

.then(()=>{ console.log('Test the new server2')
	$.GET('localhost:21202/name')
	.then($.expect(/HelloWorld/,'It lives2'))

.then(()=>{ console.log('Test the new server3')
	$.GET('localhost:21203/name')
	.then($.expect(/HelloWorld/,'It lives3'))

})})})})})})})})})

}(notesto));


