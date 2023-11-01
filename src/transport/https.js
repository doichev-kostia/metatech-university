"use strict";

const http1Factory = require("./_http.js");

module.exports = (routing, port) => {
    return http1Factory({ routing, port, options: { secure: true } });
};
