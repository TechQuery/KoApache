# KoApache

A Web server which is easy to use in Command-line or as a forked Child process based on [Koa](http://koajs.com/).

[![NPM Dependency](https://david-dm.org/TechQuery/KoApache.svg)](https://david-dm.org/TechQuery/KoApache)

[![Build Status](https://travis-ci.com/TechQuery/KoApache.svg?branch=master)](https://travis-ci.com/TechQuery/KoApache)

[![NPM](https://nodei.co/npm/koapache.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koapache/)



## Feature

 1. `index.html` omissible in URL

 2. Log **HTTP request & response** in Command-line output

 3. **Listening port** supports *Random*, *Number* or *Environment variable name*

 4. Support **CORS** headers

 5. **Reverse proxy** can be configurated in `package.json`
    - [Parse rule](https://tech-query.me/node-toolkit/function/index.html#static-function-configOf)
    - [Example](https://github.com/TechQuery/KoApache/blob/master/package.json#L73)

 6. Support to open `http://your_LAN_IP:port/` in your default browser on Command-line mode



## Usage

### Command-line

```Shell
web-server ./path/of/public/folder/
```
Help information output from `web-server -h`:

    Usage: web-server [dir] [options]

    A Web server which is easy to use in Command-line or as a forked Child process based on Koa

    Options:
        -V, --version       output the version number
        -p, --port <value>  Listening port number (support Environment variable name)
        --CORS              Enable CORS middleware
        -o, --open [path]   Open the Index or specific page in default browser
        -h, --help          output usage information


### Module

```JavaScript
import WebServer from 'koapache';

const server = new WebServer(
    './path/of/public/folder/',
    'DOCKER_INTERNAL_PORT',        //  Get listening port from Shell environment
    true,                          //  enable CORS
    {                              //  Reverse proxy map based on String#replace()
      "^/github/(.+)":  "https://api.github.com/$1"
    }
);

server.workerHost().then(address  =>  console.dir( address ));
```
API document is accessed through `npm start` (offline), `npm docs` (online) or [Official Website](https://tech-query.me/KoApache/).



## Typical case

https://www.npmjs.com/browse/depended/koapache
