const { Server } = require('ws');
const logger = require("../logger.js");
const { createHttpServer } = require("../http-utils.js");
/**
 *
 * @param {  import("./tranport.d.ts").Transport & {
 *  options: {
 *      secure: boolean,
 *  },
 * }} parameters
 */
function webSocketFactory({ routing, port, options}) {
    let ws;
    if (options.secure) {
        const server = createHttpServer(() => undefined, {
            secure: true,
        })

        ws = new Server({
            server,
        })

        server.listen(port);
    } else {
        ws = new Server({
            port
        });
    }

    ws.on('connection', (connection, req) => {
        const ip = req.socket.remoteAddress;
        connection.on('message', async (message) => {
            const obj = JSON.parse(message);
            const { name, method, data } = obj;
            const entity = routing[name];
            if (!entity) {
                connection.send('"Not found"', { binary: false });
                return;
            }
            const handler = entity[method];
            if (!handler) {
                connection.send('"Not found"', { binary: false });
                return;
            }
            logger.log(`${ip} ${name}.${method}(${JSON.stringify(data)})`);
            try {
                const result = await handler(data);
                connection.send(JSON.stringify(result.rows), { binary: false });
            } catch (err) {
                logger.error(err);
                connection.send('"Server error"', { binary: false });
            }
        });
    });

    logger.log(`API on port ${port}`);

    return ws;
}

module.exports = webSocketFactory;
