import { Context, Next } from 'koa';
import FormData from 'form-data';
import { createReadStream } from 'fs';
import { request } from '@tech_query/node-toolkit';

function buildData({ method, request: { type, body, files = {} } }: Context) {
    if (/^Head|Get|Delete$/.test(method)) return '';

    if (type !== 'multipart/form-data') return body;

    const form = new FormData();

    for (const key in body) form.append(key, body[key]);

    for (const [key, data] of Object.entries(files)) {
        const files = data instanceof Array ? data : [data];

        for (const { path, name } of files)
            form.append(key, createReadStream(path), name);
    }
    return form;
}

async function pipe(URL: string, context: Context) {
    const { host, ...headers } = context.header;

    const response = await request(
        URL,
        context.method,
        headers,
        buildData(context)
    );

    (context.status = response.statusCode),
        (context.message = response.statusMessage);

    for (const key in response.headers)
        if (key !== 'status')
            context.set(
                key.replace(/^\w|-\w/g, char => char.toUpperCase()),
                response.headers[key]
            );

    return (context.body = response);
}

export default function (proxyMap: Record<string, RegExp>) {
    return async function (context: Context, next: Next) {
        const URL = context.path + context.request.search;

        for (const path in proxyMap) {
            const final = URL.replace(proxyMap[path], path);

            if (final !== URL) return pipe(final, context);
        }

        await next();
    };
}
