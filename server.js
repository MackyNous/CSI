import { join } from 'path';
import { Server } from 'hapi';
import Inert from 'inert';

const server = new Server({
    port: 80,
    routes: {
        files: {
            relativeTo: join(__dirname, 'front-end')
        }
    }
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
                index: true,
            }
        }
    });

    await server.start();

    console.log('Server running at:', server.info.uri);
	console.log(join(__dirname, 'front-end'));
};

provision();