#! /usr/bin/env node

const Koa = require('koa'), Static = require('koa-static');

const Logger = require('koa-logger'), CORS = require('@koa/cors');

const Commander = require('commander'), IP = require('internal-ip');

const URL_utility = require('url'), open = require('opn');

const config = require('../package.json');

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
    .action( boot_server )
    .parse( process.argv );

if (! Commander.args[0])  boot_server.call( Commander );


function boot_server(dir = '.') {

    const app = (new Koa()).use( Logger() ),
        port = (! this.port)  ?  0  :  (
            isNaN( this.port )  ?  process.env[ this.port ]  :  +this.port
        );

    if ( this.CORS )  app.use( CORS() );

    app.use( Static( dir ) );

    app.listen(port,  async function () {

        var address = Object.assign(this.address(), {
            family:     'IPv4',
            address:    IP.v4.sync()
        });

        if ( process.send )
            return process.send({
                type:    'ready',
                data:    address
            });

        address = `http://${address.address}:${address.port}`;

        console.info(`Web server runs at ${address}`);

        if ( Commander.open )
            await open(
                (typeof Commander.open !== 'string')  ?
                    address  :  URL_utility.resolve(address, Commander.open)
            );
    }).on('error',  (error) => {

        if ( process.send )
            process.send({
                type:    'error',
                data:    error
            });
        else
            console.error( error );
    });
}
