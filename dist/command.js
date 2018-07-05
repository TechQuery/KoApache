#! /usr/bin/env node

//
//  Generated by https://www.npmjs.com/package/amd-bundle
//
(function (factory) {

    if ((typeof define === 'function')  &&  define.amd)
        define('command', ["koa","koa-logger","@koa/cors","koa-static","internal-ip","opn","url","path","child_process","babel-polyfill","commander","fs"], factory);
    else if (typeof module === 'object')
        return  module.exports = factory(require('koa'),require('koa-logger'),require('@koa/cors'),require('koa-static'),require('internal-ip'),require('opn'),require('url'),require('path'),require('child_process'),require('babel-polyfill'),require('commander'),require('fs'));
    else
        return  this['command'] = factory(this['koa'],this['koa-logger'],this['@koa/cors'],this['koa-static'],this['internal-ip'],this['opn'],this['url'],this['path'],this['child_process'],this['babel-polyfill'],this['commander'],this['fs']);

})(function (koa,koa_logger,_koa_cors,koa_static,internal_ip,opn,url,path,child_process,babel_polyfill,commander,fs) {

function merge(base, path) {

    return (base + '/' + path).replace(/\/\//g, '/').replace(/[^/.]+\/\.\.\//g, '').replace(/\.\//g, function (match, index, input) {

        return input[index - 1] === '.' ? match : '';
    });
}

    var require = _require_.bind(null, './');

    function _require_(base, path) {

        var module = _module_[
                /^[^./]/.test( path )  ?  path  :  ('./' + merge(base, path))
            ],
            exports;

        if (! module.exports) {

            module.exports = { };

            var dependency = module.dependency;

            for (var i = 0;  dependency[i];  i++)
                module.dependency[i] = require( dependency[i] );

            exports = module.factory.apply(
                null,  module.dependency.concat(
                    _require_.bind(null, module.base),  module.exports,  module
                )
            );

            if (exports != null)  module.exports = exports;

            delete module.dependency;  delete module.factory;
        }

        return module.exports;
    }

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _module_ = {
    './WebServer': {
        base: '.',
        dependency: [],
        factory: function factory(require, exports, module) {
            Object.defineProperty(exports, "__esModule", {
                value: true
            });

            var _koa = require('koa');

            var _koa2 = _interopRequireDefault(_koa);

            var _koaLogger = require('koa-logger');

            var _koaLogger2 = _interopRequireDefault(_koaLogger);

            var _cors = require('@koa/cors');

            var _cors2 = _interopRequireDefault(_cors);

            var _koaStatic = require('koa-static');

            var _koaStatic2 = _interopRequireDefault(_koaStatic);

            var _internalIp = require('internal-ip');

            var _internalIp2 = _interopRequireDefault(_internalIp);

            var _opn = require('opn');

            var _opn2 = _interopRequireDefault(_opn);

            var _url = require('url');

            var _path = require('path');

            var _child_process = require('child_process');

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            /**
             * Web server
             */

            var WebServer = function () {
                /**
                 * @param {string}         [staticPath='.']
                 * @param {number}         [netPort=0]
                 * @param {boolean}        [XDomain=false]
                 * @param {boolean|string} [openURL=false]
                 */
                function WebServer(staticPath, netPort, XDomain, openURL) {
                    _classCallCheck(this, WebServer);

                    /**
                     * @type {string}
                     */
                    this.staticPath = staticPath || '.';

                    /**
                     * @type {number}
                     */
                    this.netPort = !netPort ? 0 : isNaN(netPort) ? process.env[netPort] : +netPort;

                    /**
                     * @type {Application}
                     */
                    this.core = new _koa2.default().use((0, _koaLogger2.default)());

                    /**
                     * @type {boolean}
                     */
                    this.XDomain = XDomain;

                    if (XDomain) this.core.use((0, _cors2.default)());

                    this.core.use((0, _koaStatic2.default)(this.staticPath));

                    /**
                     * @type {boolean|string}
                     */
                    this.openPath = openURL;

                    /**
                     * @type {ServerAddress}
                     */
                    this.address = null;
                }

                /**
                 * Origin URI
                 *
                 * @type {string}
                 */


                _createClass(WebServer, [{
                    key: 'localHost',


                    /**
                     * Create a server in the same Node.JS process
                     *
                     * @return {Server} HTTP server
                     */
                    value: function localHost() {

                        var server = this;

                        return this.core.listen(this.netPort, _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:

                                            server.address = Object.assign(this.address(), {
                                                family: 'IPv4',
                                                address: _internalIp2.default.v4.sync()
                                            });

                                            if (!process.send) {
                                                _context.next = 3;
                                                break;
                                            }

                                            return _context.abrupt('return', process.send({ type: 'ready', data: server.address }));

                                        case 3:

                                            console.info('Web server runs at ' + server.URL);

                                            if (!server.openPath) {
                                                _context.next = 7;
                                                break;
                                            }

                                            _context.next = 7;
                                            return (0, _opn2.default)(server.openURL);

                                        case 7:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, this);
                        }))).on('error', function (error) {

                            if (process.send) process.send({
                                type: 'error',
                                data: error
                            });else console.error(error);
                        });
                    }

                    /**
                     * Boot a server in a forked Node.JS process
                     *
                     * @return {Promise<ServerAddress>}
                     */

                }, {
                    key: 'workerHost',
                    value: function workerHost() {

                        var child = (0, _child_process.fork)((0, _path.join)(process.argv[0], '../../dist/command'), [this.staticPath, '-p', this.netPort, this.XDomain && '--CORS'], {
                            execArgv: [],
                            silent: true
                        });

                        return new Promise(function (resolve, reject) {

                            child.on('message', function (event) {

                                switch (event.type) {
                                    case 'ready':
                                        return resolve(event.data);
                                    case 'error':
                                        {

                                            var error = event.data;

                                            reject(Object.assign(new global[error.name](error.message), error));
                                        }
                                }
                            });
                        });
                    }
                }, {
                    key: 'URL',
                    get: function get() {

                        var address = this.address;

                        return address ? 'http://' + address.address + ':' + address.port : '';
                    }

                    /**
                     * URL to open in default browser
                     *
                     * @type {string}
                     */

                }, {
                    key: 'openURL',
                    get: function get() {

                        return typeof this.openPath !== 'string' ? this.URL : (0, _url.resolve)(this.URL, this.openPath);
                    }
                }]);

                return WebServer;
            }();

            exports.default = WebServer; /**
                                          * @typedef {Object} ServerAddress
                                          *
                                          * @property {string} family  - `IPv4`
                                          * @property {string} address - IP address
                                          * @property {number} port    - Network listening port
                                          */
            /**
             * @external {Application} https://github.com/koajs/koa/blob/master/docs/api/index.md#application
             */
        }
    },
    './command': {
        base: '.',
        dependency: [],
        factory: function factory(require, exports, module) {
            require('babel-polyfill');

            var _commander = require('commander');

            var _commander2 = _interopRequireDefault(_commander);

            var _WebServer = require('./WebServer');

            var _WebServer2 = _interopRequireDefault(_WebServer);

            var _path = require('path');

            var _fs = require('fs');

            function _interopRequireDefault(obj) {
                return obj && obj.__esModule ? obj : { default: obj };
            }

            var config = JSON.parse((0, _fs.readFileSync)((0, _path.join)(process.argv[1], '../../package.json')));

            _commander2.default.version(config.version).description(config.description).arguments('[dir]').option('-p, --port <value>', 'Listening port number (support Environment variable name)').option('--CORS', 'Enable CORS middleware').option('-o, --open [path]', 'Open the Index or specific page in default browser').parse(process.argv);

            var server = new _WebServer2.default(_commander2.default.args[0], _commander2.default.port, _commander2.default.CORS, _commander2.default.open);

            server.localHost();
        }
    },
    'koa': { exports: koa },
    'koa-logger': { exports: koa_logger },
    '@koa/cors': { exports: _koa_cors },
    'koa-static': { exports: koa_static },
    'internal-ip': { exports: internal_ip },
    'opn': { exports: opn },
    'url': { exports: url },
    'path': { exports: path },
    'child_process': { exports: child_process },
    'babel-polyfill': { exports: babel_polyfill },
    'commander': { exports: commander },
    'fs': { exports: fs }
};

    return require('./command');
});