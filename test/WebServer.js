import { configOf } from '../source/utility';

import { resourceFrom } from '../source/ProxyAgent';

import WebServer from '../source/WebServer';


/**
 * @test {WebServer}
 */
describe('Server core',  () => {

    var config = configOf('koapache'), server;
    /**
     * @test {WebServer#URL}
     * @test {WebServer#openURL}
     */
    it('URL getters',  () => {

        server = new WebServer('docs/', 0, true, config.proxy, 'test/');

        server.address = {
            address:  '127.0.0.1',
            port:     80
        };

        server.URL.should.be.equal('http://127.0.0.1:80');

        server.openURL.should.be.equal('http://127.0.0.1:80/test/');
    });

    /**
     * @test {WebServer#boot}
     * @test {WebServer#localHost}
     */
    it('Middlewares for Static files',  async () => {

        server.openPath = null;

        await  new Promise((resolve, reject) =>
            server.localHost().on('listening', resolve).on('error', reject)
        );

        const response = await resourceFrom( server.URL );

        response.should.be.html();
    });

    /**
     * @test {ProxyAgent}
     */
    it('Reverse proxy',  async () => {

        const response = await resourceFrom(`${server.URL}/github/users/TechQuery`);

        response.should.be.json();
    });

    /**
     * @test {WebServer#workerHost}
     */
    it('Host in a worker process',  async () => {

        const meta = await server.workerHost();

        meta.should.match({
            family:   'IPv4',
            address:  /^(\d{1,3}\.){3}\d{1,3}$/
        });

        meta.port.should.be.within(1024, 65535);
    });
});
