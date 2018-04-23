#! /usr/bin/env node

const Koa = require('koa'), Static = require('koa-static'), IP = require('internal-ip');

const app = (new Koa()).use( Static( process.argv[2] ) );


app.listen(function () {

    const address = Object.assign(this.address(), {
        family:     'IPv4',
        address:    IP.v4.sync()
    });

    if ( process.send )
        process.send({
            type:    'ready',
            data:    address
        });
    else
        console.info(
            `Web server runs at http://${address.address}:${address.port}`
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
