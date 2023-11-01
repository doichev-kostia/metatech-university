"use strict";

const http = require("node:http");
const { httpRouting, NotFound } = require("../http-routing.js");

const parseBody = async (req) => {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
};

const HEADERS = {
    "X-XSS-Protection": "1; mode=block",
    "X-Content-Type-Options": "nosniff",
    "Strict-Transport-Security": "max-age=31536000; includeSubdomains; preload",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json; charset=UTF-8",
};

module.exports = (routing, port) => {
    http.createServer(async (req, res) => {
        const { url, socket } = req;
        try {
            const handler = httpRouting(routing, url);
            if (req.method === "OPTIONS") {
                res.writeHead(200, HEADERS);
                return void res.end(http.STATUS_CODES[200]);
            } else if (req.method !== "POST") {
                res.writeHead(405);
                return void res.end(http.STATUS_CODES[405]);
            }

            const data = await parseBody(req);
            console.log(`${socket.remoteAddress} ${method} ${url}`);
            const result = await handler(data);
            res.writeHead(200, HEADERS);
            res.end(JSON.stringify(result.rows));
        } catch (error) {
            console.error(error);
            if (error instanceof NotFound) {
                res.writeHead(404, HEADERS);
                return void res.end(http.STATUS_CODES[404]);
            } else {
                res.writeHead(500, HEADERS);
                return void res.end(http.STATUS_CODES[500]);
            }
        }
    }).listen(port);

    console.log(`API on port ${port}`);
};
