import * as http from "./http.js";
import * as ws from "./ws.js";

const structure = {
    user: {
        create: ['record'],
        read: ['id'],
        update: ['id', 'record'],
        delete: ['id'],
        find: ['mask'],
    },
    country: {
        read: ['id'],
        delete: ['id'],
        find: ['mask'],
    },
}

function buildApi(url) {
    const u = new URL(url);
    const scheme = u.protocol.slice(0, -1);
    const transport = scheme === "ws" ? "ws" : "http";
    let client;
    if (transport === "http") {
        client = new http.Client(structure, {
            prefixURL: url
        })
    } else{
        client = new ws.Client(structure, {
            prefixURL: url
        })
    }

    return client.init();
}

export const client = await buildApi("ws://127.0.0.1:8080");
