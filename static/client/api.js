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

function buildApi(transport) {
    if (transport === "http") {
        return new http.Client(structure, {
            prefixURL: "http://127.0.0.1:8080",
        })
    } else if (transport === "ws") {
        return new ws.Client(structure, {
            url: "ws://127.0.0.1:8001/",
        })

    }
}

export const client = buildApi("http");
