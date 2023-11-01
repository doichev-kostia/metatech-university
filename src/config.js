const databaseConfig = {
  host: '127.0.0.1',
  port: 5432,
  database: 'example',
  user: 'marcus',
  password: 'marcus',
};

const saltLength = 16;
const passwordKeyLength = 64;

const ports = {
  api: 8080,
  static: 8081
};

const transportOptions = ["http", "ws"];

const transport = "http";

module.exports = {
  databaseConfig,
  saltLength,
  passwordKeyLength,
  ports,
  transport,
  transportOptions,
}
