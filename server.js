#!/usr/bin/env node

//const winston = require('winston');
const Path = require('path');
const Hapi = require('hapi');
const Inert = require('inert');
const ipset = require('netfilter').ipset;

let R = {};
global.R = R;
fs = require('fs');
R.logger = fs.createWriteStream('IDSlog.log', {'flags': 'a'});

const server = new Hapi.Server({
    port: 80,
    routes: {
        files: {
            relativeTo: Path.join(__dirname, 'front-end')
        }
    }
});

//TODO: implement winston Logger
/*
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({
            filename: 'Log/error.log',
            level: 'error'
        }),
        new winston.transports.File({
            filename: 'Log/info.log',
            level: 'info'
        })
    ]
});
*/

function execute(command) {
    const exec = require('child_process').exec;

    exec(command, (err, stdout, stderr) => {
        process.stdout.write(stdout)
    })
}

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

    //TODO: iptables shell script started by this server every 1 minute.

    await server.start();

    console.log('Server running at:', server.info.uri);
    console.log(Path.join(__dirname, 'front-end'));


};

//const interval = setInterval(function() {openShellScript;}, 60000)

provision();

//TODO: add here (function(request, h) {}) and use req to print out req info 

server.events.on('log', (event, tags) => {

    if (tags.error) {
        R.logger.write(`Server error: ${event.error ? event.error.message : 'unknown'}`);
        console.log(`Server error: ${event.error ? event.error.message : 'unknown'}`);
    }
});
