import 'babel-polyfill';

import Commander from 'commander';

import WebServer from './WebServer';

import { join } from 'path';

import { readFileSync } from 'fs';

import { configOf } from './utility';


const manifest = JSON.parse(
        readFileSync( join(process.argv[1], '../../package.json') )
    ),
    config = configOf('koapache');

Commander
    .version( manifest.version )
    .description( manifest.description )
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
    Commander.args[0],
    isNaN( Commander.port )  ?  process.env[ Commander.port ]  :  Commander.port,
    Commander.CORS,
    config.proxy,
    Commander.open
);

server.localHost();
