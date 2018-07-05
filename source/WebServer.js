import Koa from 'koa';

import Logger from 'koa-logger';

import CORS from '@koa/cors';

import Static from 'koa-static';

import IP from 'internal-ip';

import open from 'opn';

import {resolve} from 'url';

import { join } from 'path';

import {fork} from 'child_process';


/**
 * Web server
 */
export default  class WebServer {
    /**
     * @param {?string}        staticPath
     * @param {number}         netPort
     * @param {boolean}        XDomain
     * @param {boolean|string} [openURL]
     */
    constructor(staticPath, netPort, XDomain, openURL) {

        this.staticPath = staticPath || '.';

        this.netPort = (! netPort)  ?  0  :  (
            isNaN( netPort )  ?  process.env[ netPort ]  :  +netPort
        );

        this.core = (new Koa()).use( Logger() );

        if (this.XDomain = XDomain)  this.core.use( CORS() );

        this.core.use( Static( this.staticPath ) );

        this.openURL = openURL;

        this.address = null;
    }

    /**
     * Create a server in the same Node.JS process
     *
     * @return {Server} HTTP server
     */
    localHost() {

        const server = this;

        return  this.core.listen(this.netPort,  async function () {

            var address = Object.assign(this.address(), {
                family:     'IPv4',
                address:    IP.v4.sync()
            });

            if ( process.send )
                return  process.send({type: 'ready', data: address});

            server.address = address = `http://${address.address}:${address.port}`;

            console.info(`Web server runs at ${address}`);

            if ( server.openURL )
                await open(
                    (typeof server.openURL !== 'string')  ?
                        address  :  resolve(address, server.openURL)
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

    /**
     * Boot a server in a forked Node.JS process
     *
     * @return {Promise<ServerAddress>}
     */
    workerHost() {

        const child = fork(
            join(process.argv[0], '../../dist/command'),
            [this.staticPath,  '-p',  this.netPort,  this.XDomain && '--CORS'],
            {
                execArgv:  [ ],
                silent:    true
            }
        );

        return  new Promise((resolve, reject) => {

            child.on('message',  event => {

                switch ( event.type ) {
                    case 'ready':    return  resolve( event.data );
                    case 'error':    {

                        let error = event.data;

                        reject(Object.assign(
                            new global[ error.name ]( error.message ),  error
                        ));
                    }
                }
            });
        });
    }
}

/**
 * @typedef {Object} ServerAddress
 *
 * @property {string} family  - `IPv4`
 * @property {string} address - IP address
 * @property {number} port    - Network listening port
 */
