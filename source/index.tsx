#! /usr/bin/env node

import { configOf } from '@tech_query/node-toolkit';
import { Command, createCommand } from 'commander-jsx';

import { WebServer } from './WebServer';

const config = configOf('koapache');

interface OptionData {
    port: string;
    CORS: boolean;
    open: string | boolean;
}

Command.execute(
    <Command
        name="web-server"
        parameters="[dir] [options]"
        version="2.2.0"
        description="A Web server which is easy to use in Command-line or as a forked Child process based on Koa"
        options={{
            port: {
                shortcut: 'p',
                parameters: '<value>',
                description:
                    'Listening port number (support Environment variable name)'
            },
            CORS: { description: 'Enable CORS middleware' },
            open: {
                shortcut: 'o',
                parameters: '[path]',
                description:
                    'Open the Index or specific page in default browser'
            }
        }}
        executor={({ port, CORS, open }: OptionData, staticPath: string) => {
            if (isNaN(+port)) port = process.env[port];

            new WebServer({
                staticPath,
                netPort: port ? +port : undefined,
                XDomain: CORS,
                proxyMap: config?.proxy,
                openPath: open
            }).localHost();
        }}
    />,
    process.argv.slice(2)
);
