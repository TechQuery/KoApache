import { IncomingHttpHeaders } from 'http';
import { Context, Next } from 'koa';
import { Readable } from 'stream';

// Filter hop-by-hop headers per RFC 7230 section 6.1
const HOP_BY_HOP_HEADERS = new Set([
    'connection',
    'keep-alive',
    'proxy-connection',
    'transfer-encoding',
    'upgrade',
    'te',
    'trailer',
    'proxy-authorization',
    'proxy-authenticate'
]);

function pickProxyHeaders(headers: IncomingHttpHeaders) {
    const out: Record<string, string> = {};

    for (const [key, value] of Object.entries(headers)) {
        const lowerKey = String(key).toLowerCase();

        if (!HOP_BY_HOP_HEADERS.has(lowerKey) && lowerKey !== 'host' && value != null)
            out[lowerKey] = Array.isArray(value) ? value.join(', ') : value + '';
    }
    return out;
}

// Response headers that must not be forwarded:
// - transfer-encoding, connection, keep-alive: HTTP hop-by-hop headers (RFC 7230)
// - content-encoding: fetch() auto-decompresses, forwarding causes double-decompression
// - content-length: if content-encoding was present, length is now incorrect
const SkipResponseHeaders = new Set([
    'transfer-encoding',
    'connection',
    'keep-alive',
    'content-encoding',
    'content-length'
]);

function setKoaResponseHeaders(context: Context, headers: Headers) {
    const setCookie: string[] = [];

    for (const [key, value] of headers) {
        const lowerKey = key.toLowerCase();

        if (SkipResponseHeaders.has(lowerKey)) continue;

        if (lowerKey === 'set-cookie') setCookie.push(value);
        else if (value) context.set(key, value);
    }
    if (setCookie[0]) context.set('Set-Cookie', setCookie);
}

interface NodeFetchInit extends RequestInit {
    // Required by undici/Node fetch when passing a stream body
    duplex?: 'half';
}

async function pipe(targetURL: string, context: Context) {
    const { method } = context;
    const isBodyMethod = !/^(GET|HEAD)$/i.test(method);

    const headers = pickProxyHeaders(context.headers as IncomingHttpHeaders);

    const init: NodeFetchInit = { method, headers };

    if (isBodyMethod) {
        // stream the incoming request
        init.body = context.req as unknown as BodyInit;
        init.duplex = 'half';
    }
    const { status, statusText, headers: header, body } = await fetch(targetURL, init);

    context.status = status;
    context.message = statusText;

    setKoaResponseHeaders(context, header);

    // @ts-expect-error Web type compatibility
    if (body) context.body = Readable.fromWeb(body);
}

export function ProxyAgent(proxyMap: Record<string, RegExp>) {
    return async function (context: Context, next: Next) {
        const URI = context.path + context.request.search;

        for (const path in proxyMap) {
            const final = URI.replace(proxyMap[path], path);

            if (final !== URI) return pipe(final, context);
        }
        await next();
    };
}
