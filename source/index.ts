#! /usr/bin/env node

import { configOf } from '@tech_query/node-toolkit';
import Commander from 'commander';

import WebServer from './WebServer';

const config = configOf('koapache');

Commander.name('web-server')
    .version('2.0.0')
    .description(
        'A Web server which is easy to use in Command-line or as a forked Child process based on Koa'
    )
    .usage('[dir] [options]')
    .option(
        '-p, --port <value>',
        'Listening port number (support Environment variable name)'
    )
    .option('--CORS', 'Enable CORS middleware')
    .option(
        '-o, --open [path]',
        'Open the Index or specific page in default browser'
    )
    .parse(process.argv);

const {
    args: [staticPath],
    port,
    CORS,
    open
} = Commander;

new WebServer({
    staticPath,
    netPort: isNaN(port) ? process.env[port] : port,
    XDomain: CORS,
    proxyMap: config?.proxy,
    openPath: open
}).localHost();
