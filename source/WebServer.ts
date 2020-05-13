import Koa from 'koa';
import Logger from 'koa-logger';
import CORS from '@koa/cors';
import Body from 'koa-body';
import Static from 'koa-static';

import { AddressInfo } from 'net';
import { v4, v6 } from 'internal-ip';
import open from 'open';
import { resolve } from 'url';
import { join } from 'path';
import { fork } from 'child_process';
import { patternOf, currentModulePath } from '@tech_query/node-toolkit';

import ProxyAgent from './ProxyAgent';

interface WebServerMessage {
    type: string;
    data: Record<string, any>;
}

export default class WebServer {
    staticPath?: string;
    netPort?: number;
    XDomain?: boolean;
    openPath?: boolean | string;
    address?: AddressInfo;

    private core: Koa;
    private proxyMap: ReturnType<typeof patternOf>;

    constructor({
        proxyMap = {},
        ...rest
    }: {
        staticPath?: string;
        netPort?: number;
        XDomain?: boolean;
        openPath?: boolean | string;
        proxyMap?: Parameters<typeof patternOf>[0];
    } = {}) {
        Object.assign(this, rest);
        this.address = null;

        this.core = new Koa();
        this.proxyMap = patternOf(proxyMap);

        this.boot();
    }

    private boot() {
        this.core.use(Logger());

        if (this.proxyMap)
            this.core
                .use(Body({ multipart: true }))
                .use(ProxyAgent(this.proxyMap));

        if (this.XDomain) this.core.use(CORS());

        this.core.use(Static(this.staticPath));
    }

    /**
     * Origin URI
     */
    get URL() {
        const { address: { address, port } = {} } = this;

        return address ? `http://${address}:${port}` : '';
    }

    /**
     * URL to open in default browser
     */
    get openURL() {
        const { openPath, URL } = this;

        return typeof openPath !== 'string' ? URL : resolve(URL, openPath);
    }

    static getIPA() {
        const address = v4.sync() || v6.sync() || '127.0.0.1';

        return {
            family: address.includes(':') ? 'IPv6' : 'IPv4',
            address
        };
    }

    /**
     * Create a server in the same Node.JS process
     */
    localHost() {
        const server = this;

        return this.core
            .listen(this.netPort, async function () {
                server.address = {
                    ...this.address(),
                    ...WebServer.getIPA()
                };

                if (process.send instanceof Function)
                    return process.send({
                        type: 'ready',
                        data: server.address
                    });

                console.info(`Web server runs at ${server.URL}`);

                if (server.openPath) await open(server.openURL);
            })
            .on('error', error => {
                if (process.send instanceof Function)
                    process.send({
                        type: 'error',
                        data: error
                    });
                else console.error(error);
            });
    }

    /**
     * Boot a server in a forked Node.JS process
     */
    workerHost() {
        const child = fork(
            join(currentModulePath(), '../../dist/'),
            [
                this.staticPath,
                '-p',
                this.netPort + '',
                this.XDomain && '--CORS'
            ],
            { execArgv: [] }
        );

        return new Promise<AddressInfo>((resolve, reject) =>
            child.on('message', ({ type, data }: WebServerMessage) => {
                switch (type) {
                    case 'ready':
                        return resolve(data as AddressInfo);
                    case 'error': {
                        const { name, message, ...rest } = data as Error;

                        reject(
                            Object.assign(new globalThis[name](message), rest)
                        );
                    }
                }
            })
        );
    }
}
