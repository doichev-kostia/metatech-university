const scaffold = (structure, socket) => {
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = (data) => new Promise((resolve) => {
        const packet = { name: serviceName, method: methodName, data };
        socket.send(JSON.stringify(packet));
        socket.onmessage = (event) => {
          const response = JSON.parse(event.data);
          resolve(response);
        };
      });
    }
  }
  return api;
};

export class Client {
    #config;
    #socket;
    #api;
    /**
     *
     * @param {Record<string, Record<string, string[]>>} structure
     * @param {{
     *   prefixURL: string,
     * }}options
     */
    constructor(structure, options) {
        this.#config = {...options};
        this.#socket = new WebSocket(this.#config.prefixURL);
        this.#api = scaffold(structure, this.socket);
    }


    get socket() {
        return this.#socket;
    }

    get api() {
        return this.#api;
    }
}
