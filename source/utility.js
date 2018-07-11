import { readFileSync } from 'fs';

import { get } from 'http';


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
 * HTTP `GET` method
 *
 * @param {string} URL
 *
 * @return {Promise<IncomingMessage>}
 */
export function getResourceOf(URL) {

    return  new Promise(
        (resolve, reject)  =>  get(URL, resolve).on('error', reject)
    );
}
