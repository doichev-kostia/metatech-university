"use strict";

const fsp = require("node:fs").promises;
const path = require("node:path");
const staticServer = require("./static.js");
const load = require("./load.js");
const db = require("./db.js");
const hash = require("./hash.js");
const logger = require("./logger.js");
const { ports, transport, transportOptions } = require("./config.js");
const { stringifyArray } = require("./utils.js");

const sandbox = {
    console: Object.freeze(logger),
    db: Object.freeze(db),
    common: { hash },
};
const apiPath = path.join(process.cwd(), "./src/api");
const routing = {};

/**
 * @type {(routing: Record<string, any>, port: number) => void}
 */
let server;
try {
    server = require(`./transport/${transport}.js`);
} catch (error) {
    if (transportOptions.includes(transport)) {
        logger.error({ error }, `Failed to load transport ${transport}.`);
    } else {
        logger.error(`Invalid transport specified. Expected ${stringifyArray(transportOptions)}, got ${transport}`);
    }

    throw new Error(`Failed to load transport ${transport}.`);
}


(async () => {
    const files = await fsp.readdir(apiPath);
    for (const fileName of files) {
        if (!fileName.endsWith(".js")) continue;
        const filePath = path.join(apiPath, fileName);
        const serviceName = path.basename(fileName, ".js");
        routing[serviceName] = await load(filePath, sandbox);
    }

    staticServer(path.resolve('./static'), ports.static);
    server(routing, ports.api);
})();
