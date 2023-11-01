const path = require("node:path");

const databaseConfig = {
    host: "127.0.0.1",
    port: 5432,
    database: "example",
    user: "marcus",
    password: "marcus",
};

const saltLength = 16;
const passwordKeyLength = 64;

const ports = {
    api: 8080,
    static: 8081
};

const transportOptions = ["http", "ws", "https", "wss"];

const transport = "https";

const tlsConfig = {
    key: path.resolve(process.cwd(), "tls", "key.pem"),
    cert: path.resolve(process.cwd(), "tls", "cert.pem"),
};

const staticOptions = {
    secure: transport === "https" || transport === "wss",
}

module.exports = {
    databaseConfig,
    saltLength,
    passwordKeyLength,
    ports,
    transport,
    transportOptions,
    tlsConfig,
    staticOptions
};
