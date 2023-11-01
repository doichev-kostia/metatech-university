'use strict';

const webSocketFactory = require("./_ws.js");

module.exports = (routing, port) => {
    webSocketFactory({ routing, port, options: { secure: true } });
};
