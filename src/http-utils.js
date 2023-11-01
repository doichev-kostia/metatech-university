const fs = require("node:fs");
const { tlsConfig } = require("./config.js");

function httpRouting(routes, url) {
    const [name, method] = url.substring(1).split("/");
    const entity = routes[name];

    if (!entity) throw new NotFound(`Entity ${name} not found`);

    const handler = entity[method];

    if (!handler) throw new NotFound(`Method ${method} not found`);

    return handler;
}

async function parseBody(req) {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
}

class NotFound extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFound";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

function createHttpServer(cb, {secure = false} = {}) {
    let http;
    if (secure) {
        http = require("node:https");
    } else {
        http = require("node:http");
    }

    let serverOptions = {};
    if (secure) {
        serverOptions = {
            key: fs.readFileSync(tlsConfig.key),
            cert: fs.readFileSync(tlsConfig.cert),
        };
    }

    return http.createServer(serverOptions, cb);
}

/**
 *
 * @param {AddressInfo | string | null} address
 * @return {string | null}
 */
function getHost(address) {
    if (typeof address !== "object") return address;

    const { address: host, port, family } = address;

    if (family === "IPv6") return `[${host}]:${port}`;

    return `${host}:${port}`;
}


module.exports = {
    httpRouting,
    NotFound,
    parseBody,
    createHttpServer,
    getHost
}
