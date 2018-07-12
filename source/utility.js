import { readFileSync } from 'fs';


/**
 * Get configuration of a Package from `package.json` in `process.cwd()`
 *
 * @param {string} name
 *
 * @return {?Object} (`process.env.NODE_ENV` will affect the result)
 */
export function configOf(name) {

    const config = JSON.parse( readFileSync('./package.json') )[ name ];

    if ( config )
        return  config.env  ?  config.env[ process.env.NODE_ENV ]  :  config;
}


/**
 * @param {Object} map - Key for RegExp source, value for replacement
 *
 * @return {?Object} Key for replacement, value for RegExp
 */
export function patternOf(map) {

    var patternMap = { }, count = 0;

    for (let pattern in map)
        patternMap[ map[ pattern ] ] = new RegExp( pattern ),  count++;

    return  count ? patternMap : null;
}


/**
 * @return {string}
 */
export function currentModulePath() {

    try {  throw Error();  } catch (error) {

        return  error.stack.split( /[\r\n]+/ )[2]
            .match( /at .+?\((.+):\d+:\d+\)/ )[1];
    }
}
