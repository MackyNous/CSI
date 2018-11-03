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


    //TODO: add ufw/iptables section
    //Read login.log file
    //if user attempts > 5 : block for 10 min
    //add new log to info.log

    //ipset create blacklist hash:ip hashsize 4096
    //iptables -I INPUT -m set --match-set blacklist src -j DROP
    //iptables -I FORWARD -m set --match-set blacklist src -j DROP
    //ipset add blacklist 192.168.1.100

    ipset.create({
       setname: 'blacklist',
       type: 'hash:ip',
       create_options: {
           hashsize: 4096
       }
    }, function(error) {
        if(error) {
            R.logger.write("ipset.create: " + error);
            console.log("ipset.create: " + error);
        }
    });

    execute('iptables -I INPUT -m set --match-set blacklist src -j DROP');
    execute('iptables -I FORWARD -m set --match-set blacklist src -j DROP');

    await server.start();

    console.log('Server running at:', server.info.uri);
    console.log(Path.join(__dirname, 'front-end'));

};

provision();

//TODO: add here (function(request, h) {}) and use req to print out req info 

server.events.on('log', (event, tags) => {

    if (tags.error) {
        R.logger.write(`Server error: ${event.error ? event.error.message : 'unknown'}`);
        console.log(`Server error: ${event.error ? event.error.message : 'unknown'}`);
    }
});