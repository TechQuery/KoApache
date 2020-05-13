import { configOf, request, readStream } from '@tech_query/node-toolkit';

import WebServer from '../source/WebServer';

/**
 * @test {WebServer}
 */
describe('Server core', () => {
    const config = configOf('koapache');

    let server: WebServer;
    /**
     * @test {WebServer#URL}
     * @test {WebServer#openURL}
     */
    it('URL getters', () => {
        server = new WebServer({
            staticPath: 'docs/',
            netPort: 0,
            XDomain: true,
            proxyMap: config.proxy,
            openPath: 'test/'
        });

        server.address = {
            family: 'IPv4',
            address: '127.0.0.1',
            port: 80
        };

        expect(server.URL).toBe('http://127.0.0.1:80');

        expect(server.openURL).toBe('http://127.0.0.1:80/test/');
    });

    /**
     * @test {WebServer#boot}
     * @test {WebServer#localHost}
     */
    it('Middlewares for Static files', async () => {
        server.openPath = null;

        await new Promise((resolve, reject) =>
            server.localHost().on('listening', resolve).on('error', reject)
        );

        const response = await readStream(await request(server.URL));

        expect(typeof response === 'string').toBeTruthy();
    });

    /**
     * @test {ProxyAgent}
     */
    it('Reverse proxy', async () => {
        const response = await readStream(
            await request(`${server.URL}/github/users/TechQuery`)
        );
        expect(typeof response === 'object').toBeTruthy();
    });

    /**
     * @test {WebServer#workerHost}
     */
    it('Host in a worker process', async () => {
        const meta = await server.workerHost();

        expect(meta).toMatchObject({
            family: 'IPv4',
            address: /^(\d{1,3}\.){3}\d{1,3}$/
        });
        expect(meta.port > 1024).toBeTruthy();
        expect(meta.port < 65536).toBeTruthy();
    });
});
