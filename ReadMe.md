# KoApache

A Web server which is easy to use in command-line or as a forked Child process based on [Koa](http://koajs.com/).

[![NPM Dependency](https://david-dm.org/TechQuery/KoApache.svg)](https://david-dm.org/TechQuery/KoApache)

[![NPM](https://nodei.co/npm/koapache.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/koapache/)



## Feature

 1. `index.html` omissible in URL

 2. Log **HTTP request & response** in Command-line output

 3. **Listening port** supports *Random*, *Number* or *Environment variable name*

 4. Support **CORS** headers

 5. Support to open `http://your_LAN_IP:port/` in your default browser on Command-line mode



## Usage

### Command-line

```Shell
web-server ./path/of/public/folder/
```
Execute `web-server -h` for the detail about more options.


### Module

```JavaScript
(async () => {

    const WebServer = require('koapache');

    const address = await WebServer(
        './path/of/public/folder/',
        'DOCKER_INTERNAL_PORT',        // Get listening port from Shell environment
        true                           // enable CORS
    );

    console.dir( address );
})();
```
