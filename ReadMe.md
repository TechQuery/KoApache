# KoApache

A Web server which is easy to use in Command-line or as a forked Child process based on [Koa][1].

[![NPM Dependency](https://david-dm.org/TechQuery/KoApache.svg)][2]
[![Build Status](https://travis-ci.com/TechQuery/KoApache.svg?branch=master)][3]

[![NPM](https://nodei.co/npm/koapache.png?downloads=true&downloadRank=true&stars=true)][4]

## Feature

1.  `index.html` omissible in URL

2.  Log **HTTP request & response** in Command-line output

3.  **Listening port** supports _Random_, _Number_ or _Environment variable name_

4.  Support **CORS** headers

5.  **Reverse proxy** can be configurated in `package.json`

    -   [Parse rule](https://tech-query.me/node-toolkit/globals.html#configof)
    -   [Example](https://github.com/TechQuery/KoApache/blob/master/package.json#L90)

6.  Support to open `http://your_LAN_IP:port/` in your default browser on Command-line mode

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

const server = new WebServer({
    staticPath: './path/of/public/folder/',
    netPort: 'DOCKER_INTERNAL_PORT',         //  Get listening port from Shell environment
    XDomain: true,                           //  enable CORS
    proxyMap: {                              //  Reverse proxy map based on String#replace()
      "^/github/(.+)":  "https://api.github.com/$1"
    }
});

server.workerHost().then(address  =>  console.dir( address ));
```

API document is accessed through `npm start` (offline), `npm docs` (online) or [Official Website][5].

## Typical case

https://www.npmjs.com/package/koapache?activeTab=dependencies

[1]: http://koajs.com/
[2]: https://david-dm.org/TechQuery/KoApache
[3]: https://travis-ci.com/TechQuery/KoApache
[4]: https://nodei.co/npm/koapache/
[5]: https://tech-query.me/KoApache/
