nt = require("./notesto.js");

const IDS_server = 
{	name: 'IDS',
			port: 10009,
			version: 1,
			init: () => { $.trace(1,'IDS$init:1')
				$.keys=$.ppks();
				$.xPOSTjson('localhost:10000/provide',{puk:$.keys.puk, port:$.port, srvc:'IDS'});
			},
			POST: {
				"log/{info}": async ($) => {   $.trace(1,'IDS$log/{info}:1')
					console.log('recieved');
					var entry = $.PATH.info;
					var login = $.PARAM.login;
					var ip = $.PARAM.ip;
					var date = new Date();
					if (login == "pass") var log = (date+" | User "+entry+" Logged in | from IP: "+ip+"\\n");
					else if (login == "noRights") var log = (date+" | User "+entry+" failed attempt to login, no rights | From IP: "+ip+"\\n");
					else if (login == "mismatch") var log = (date+" | User "+entry+" failed attempt to login, password mismatch | From IP: "+ip+"\\n");
					else var log = ("User "+entry+ "Tried to login, login status: unknown | From IP: "+ip+"\\n");
					console.log(log);
					R.logger.write(log);
					return 'OK';
				}
			},
		}

nt.xPOSTjson('localhost:9999/create',
		`${IDS_server}`)
		.then(nt.expect(/^SubServer.*$/, 'Start a Subserver'))
