import { configOf, patternOf, currentModulePath } from '../source/utility';

import { resourceFrom } from '../source/ProxyAgent';



describe('Utility',  () => {

    var config;
    /**
     * @test {configOf}
     */
    it('Get configuration from "package.json"',  () => {

        config = configOf('koapache');

        config.should.be.eql({
            proxy:  {
                '^/github/(.+)':  'https://api.github.com/$1'
            }
        });
    });

    /**
     * @test {patternOf}
     */
    it(
        'Map String config to RegExp edition',
        ()  =>  patternOf( config.proxy ).should.be.eql({
            'https://api.github.com/$1':  /^\/github\/(.+)/
        })
    );

    /**
     * @test {currentModulePath}
     */
    it(
        'Get path of current module',
        ()  =>  currentModulePath().should.match( /^\w:\/.+\/test\/utility\.js$/ )
    );

    /**
     * @test {resourceFrom}
     */
    it('HTTP(S) request',  async () => {

        (await resourceFrom('https://github.com')).should.be.html();

        (await resourceFrom('https://api.github.com')).should.be.json();
    });
});
