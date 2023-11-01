"use strict";

const http = require("node:http");

const parseBody = async (req) => {
    const buffers = [];
    for await (const chunk of req) buffers.push(chunk);
    const data = Buffer.concat(buffers).toString();
    return JSON.parse(data);
};

module.exports = (routing, port) => {
    http.createServer(async (req, res) => {
        const { url, socket } = req;
        const [name, method] = url.substring(1).split("/");
        const entity = routing[name];
        if (!entity) return void res.end("Not found");
        const handler = entity[method];
        if (!handler) return void res.end("Not found");
        if (req.method === "OPTIONS") {
            res.writeHead(200, {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            });
            return void res.end(http.STATUS_CODES[200]);
        } else if (req.method !== "POST") {
            res.writeHead(405)
            return void res.end(http.STATUS_CODES[405]);
        }
        const data = await parseBody(req);
        console.log(`${socket.remoteAddress} ${method} ${url}`);
        const result = await handler(data);
        res.writeHead(200, {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
            "Content-Type": "application/json; charset=UTF-8",
        });
        res.end(JSON.stringify(result.rows));
    }).listen(port);

    console.log(`API on port ${port}`);
};
