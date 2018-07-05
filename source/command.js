import 'babel-polyfill';

import Commander from 'commander';

import WebServer from './WebServer';

import { join } from 'path';

import { readFileSync } from 'fs';

const config = JSON.parse(
    readFileSync( join(process.argv[1], '../../package.json') )
);


Commander
    .version( config.version )
    .description( config.description )
    .arguments('[dir]')
    .option(
        '-p, --port <value>',
        'Listening port number (support Environment variable name)'
    )
    .option('--CORS',  'Enable CORS middleware')
    .option(
        '-o, --open [path]',
        'Open the Index or specific page in default browser'
    )
    .parse( process.argv );


const server = new WebServer(
    Commander.args[0], Commander.port, Commander.CORS, Commander.open
);

server.localHost();
