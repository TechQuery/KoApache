#! /usr/bin/env node

const Koa = require('koa'), Static = require('koa-static');

const Logger = require('koa-logger'), CORS = require('@koa/cors');

const Commander = require('commander'), IP = require('internal-ip'), open = require('opn');

const config = require('../package.json');

Commander
    .version( config.version )
    .description( config.description )
    .arguments('[dir]')
    .option('-o, --open',  'Open URL in default browser')
    .option('--CORS',  'Enable CORS middleware')
    .action( boot_server )
    .parse( process.argv );

if (! Commander.args[0])  boot_server.call( Commander );


function boot_server(dir = '.') {

    const app = (new Koa()).use( Logger() );

    if ( this.CORS )  app.use( CORS() );

    app.use( Static( dir ) );

    app.listen(async function () {

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

        await open( address );

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
