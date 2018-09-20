import FormData from 'form-data';

import { createReadStream } from 'fs';

import { request } from '@tech_query/node-toolkit';


/**
 * @external {Context} https://github.com/koajs/koa/blob/master/docs/api/context.md
 */


/**
 * @param {Context} context
 *
 * @return {FormData|Object|string}
 */
function buildData(context) {

    if (/^Head|Get|Delete$/.test( context.method ))  return '';

    const request = context.request;

    if (request.type !== 'multipart/form-data')  return request.body;

    const form = new FormData();

    for (let key in request.fields)  form.append(key, request.fields[ key ]);

    for (let key in request.files)
        for (let file  of  request.files[ key ])
            form.append(key,  createReadStream( file.path ),  file.name);

    return form;
}


/**
 * @param {string}  URL
 * @param {Context} context
 *
 * @return {IncomingMessage}
 */
async function pipe(URL, context) {

    const header = Object.assign({ },  context.header);

    delete header.host;

    const response = await request(
        URL,  context.method,  header,  buildData( context )
    );

    context.status = response.statusCode,
    context.message = response.statusMessage;

    for (let key in response.headers)  if (key !== 'status')
        context.set(
            key.replace(/^\w|-\w/g,  char => char.toUpperCase()),
            response.headers[ key ]
        );

    return  context.body = response;
}


/**
 * @param {Object} proxyMap
 *
 * @return {AsyncFunction} Koa middleware
 */
export default  function (proxyMap) {
    /**
     * @param {Context}  context
     * @param {Function} next
     *
     * @return {?IncomingMessage}
     */
    return  async function (context, next) {

        const URL = context.path + context.request.search;

        for (let path in proxyMap) {

            let final = URL.replace(proxyMap[ path ],  path);

            if (final !== URL)  return pipe(final, context);
        }

        await next();
    };
}
