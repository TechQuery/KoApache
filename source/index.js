#! /usr/bin/env node

import '@babel/polyfill';

import Commander from 'commander';

import WebServer from './WebServer';

import { packageOf, currentModulePath, configOf } from '@tech_query/node-toolkit';


const manifest = packageOf( currentModulePath() ).meta,
    config = configOf('koapache') || { };

Commander
    .name('web-server')
    .version( manifest.version )
    .description( manifest.description )
    .usage('[dir] [options]')
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
