"use strict";

const http1Factory = require("./_http.js");

module.exports = (routing, port) => {
    http1Factory({ routing, port, options: { secure: false } });
};
