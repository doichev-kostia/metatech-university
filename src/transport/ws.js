'use strict';

const console = require('../logger.js');
const { Server } = require('ws');

module.exports = (routing, port) => {
  const ws = new Server({ port });

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
      console.log(`${ip} ${name}.${method}(${JSON.stringify(data)})`);
      try {
        const result = await handler(data);
        connection.send(JSON.stringify(result.rows), { binary: false });
      } catch (err) {
        console.error(err);
        connection.send('"Server error"', { binary: false });
      }
    });
  });

  console.log(`API on port ${port}`);
};
