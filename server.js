const winston = require('winston');
const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');

const server = new Hapi.Server({
    port: 80,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'front-end')
        }
    }
});

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'Log/error.log', level: 'error'}),
        new winston.transports.File({ filename: 'Log/info.log', level: 'info'})
    ]
});

const provision = async () => {

    await server.register(Inert);

    server.route({
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '.',
                redirectToSlash: true,
                index: true
            }
        }
      });

    await server.start();

    console.log('Server running at:', server.info.uri);
	console.log(Path.join(__dirname, 'front-end'));
};

provision();
