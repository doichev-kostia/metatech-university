const {
    httpRouting,
    parseBody,
    NotFound,
    createHttpServer, getHost
} = require("../http-utils.js");
const logger = require("../logger.js");
const { STATUS_CODES } = require("node:http")
/**
 *
 * @param {  import("./tranport.d.ts").Transport & {
 *  options: {
 *      secure: boolean,
 *  },
 * }} parameters
 */
function http1Factory({ routing, port, options }) {

    const HEADERS = {
        "X-XSS-Protection": "1; mode=block",
        "X-Content-Type-Options": "nosniff",
        "Strict-Transport-Security": "max-age=31536000; includeSubdomains; preload",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json; charset=UTF-8",
    };


    async function handler(req, res) {
        const { url, socket } = req;
        try {
            const handler = httpRouting(routing, url);
            if (req.method === "OPTIONS") {
                res.writeHead(200, HEADERS);
                return void res.end(STATUS_CODES[200]);
            } else if (req.method !== "POST") {
                res.writeHead(405);
                return void res.end(STATUS_CODES[405]);
            }

            const data = await parseBody(req);
            logger.log(`${socket.remoteAddress} ${req.method} ${url}`);
            const result = await handler(data);
            res.writeHead(200, HEADERS);
            res.end(JSON.stringify(result.rows));
        } catch (error) {
            logger.error(error.toString());
            if (error instanceof NotFound) {
                res.writeHead(404, HEADERS);
                return void res.end(JSON.stringify({
                    error: STATUS_CODES[404],
                }));
            } else {
                debugger
                res.writeHead(500, HEADERS);
                return void res.end(JSON.stringify({
                    error: STATUS_CODES[500],
                }));
            }
        }
    }


    const server = createHttpServer(handler, { secure: options.secure }).listen(port);

    const addr = server.address();
    let protocol = options.secure ? "https" : "http";
    let host = getHost(addr);

    logger.log(`API is listening on ${protocol}://${host}🚀`);

    return server;
}



module.exports = http1Factory;
