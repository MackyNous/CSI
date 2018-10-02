var Hapi = require('hapi'),
	nt = require("./notesto.js");
	const loadJsonFile = require('load-json-file');

(function(nt){

	//$.DELETE('localhost:9999/reset');

	nt.xPOSTjson('localhost:9999/create',
		`{	name: 'databaseJson',
			port: 10010,
			version: 1,
			init: () => { $.trace(1,'databaseJSON$init:1')
		},
			POST: {
				"customer": ($) => {$.trace(1,'databaseJson$database:1')
					jsn.loadJsonFile('data.json').then(json => {
					console.log(json)
					return JSON.stringify(json);
				});
			}
			},
		}`)
	.then(nt.expect(/^SubServer.*$/,'Start a Subserver'))

}(nt));
