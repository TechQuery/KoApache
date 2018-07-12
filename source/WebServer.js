import 'babel-polyfill';

import Koa from 'koa';

import { patternOf, currentModulePath } from './utility';

import Logger from 'koa-logger';

import Body from 'koa-body';

import ProxyAgent from './ProxyAgent';

import CORS from '@koa/cors';

import Static from 'koa-static';

import IP from 'internal-ip';

import open from 'opn';

import { resolve } from 'url';

import { join } from 'path';

import { fork } from 'child_process';


/**
 * Web server
 */
export default  class WebServer {
    /**
     * @param {string}         [staticPath='.']
     * @param {number}         [netPort=0]
     * @param {boolean}        [XDomain=false]
     * @param {?Object}        proxyMap         - Same as the parameter of {@link patternOf}
     * @param {boolean|string} [openURL=false]
     */
    constructor(staticPath, netPort, XDomain, proxyMap, openURL) {
        /**
         * @type {string}
         */
        this.staticPath = staticPath || '.';

        /**
         * @type {number}
         */
        this.netPort = +(netPort || 0);

        /**
         * @private
         *
         * @type {Application}
         */
        this.core = new Koa();

        /**
         * @type {boolean}
         */
        this.XDomain = XDomain;

        /**
         * @private
         *
         * @type {?Object}
         */
        this.proxyMap = patternOf( proxyMap );

        /**
         * @private
         *
         * @type {boolean|string}
         */
        this.openPath = openURL;

        /**
         * @private
         *
         * @type {ServerAddress}
         */
        this.address = null;

        this.boot();
    }

    /**
     * @private
     */
    boot() {

        this.core.use( Logger() );

        if ( this.proxyMap )
            this.core.use(
                Body({multipart: true})
            ).use(
                ProxyAgent( this.proxyMap )
            );

        if ( this.XDomain )  this.core.use( CORS() );

        this.core.use( Static( this.staticPath ) );
    }

    /**
     * Origin URI
     *
     * @type {string}
     */
    get URL() {

        const address = this.address;

        return  address ? `http://${address.address}:${address.port}` : '';
    }

    /**
     * URL to open in default browser
     *
     * @type {string}
     */
    get openURL() {

        return  (typeof this.openPath !== 'string')  ?
            this.URL  :  resolve(this.URL, this.openPath);
    }

    /**
     * Create a server in the same Node.JS process
     *
     * @return {Server} HTTP server
     */
    localHost() {

        const server = this;

        return  this.core.listen(this.netPort,  async function () {

            server.address = Object.assign(this.address(), {
                family:     'IPv4',
                address:    IP.v4.sync()
            });

            if ( process.send )
                return  process.send({type: 'ready', data: server.address});

            console.info(`Web server runs at ${server.URL}`);

            if ( server.openPath )  await open( server.openURL );

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
            join(currentModulePath(), '../../dist/koapache-cli'),
            [this.staticPath,  '-p',  this.netPort,  this.XDomain && '--CORS'],
            {execArgv:  [ ]}
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

/**
 * @external {Application} https://github.com/koajs/koa/blob/master/docs/api/index.md#application
 */
