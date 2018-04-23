# EasyWebServer

A Web server which is easy to use in command-line or as a forked Child process.

[![NPM Dependency](https://david-dm.org/TechQuery/EasyWebServer.svg)](https://david-dm.org/TechQuery/EasyWebServer)

[![NPM](https://nodei.co/npm/easy-web-server.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/easy-web-server/)



## Usage

### Command-line

```Shell
web-server ./path/of/public/folder/
```

### Module

```JavaScript
(async () => {

    const WebServer = require('easy-web-server');

    const address = await WebServer('./path/of/public/folder/');

    console.dir( address );
})();
```
