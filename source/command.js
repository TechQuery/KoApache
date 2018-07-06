import 'babel-polyfill';

import Commander from 'commander';

import WebServer from './WebServer';

import { join } from 'path';

import { readFileSync } from 'fs';

/**
 * Get configuration of a Package from `package.json` in `process.cwd()`
 *
 * @param {string} name
 *
 * @return {?Object} (`process.env.NODE_ENV` will affect the result)
 */
export function configOf(name) {

    const config = JSON.parse( readFileSync('./package.json') )[ name ];

    if ( config )
        return  config.env  ?  config.env[ process.env.NODE_ENV ]  :  config;
}


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
    Commander.args[0], Commander.port, Commander.CORS, config.proxy, Commander.open
);

server.localHost();
