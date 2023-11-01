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
        this.#config = { ...options };
        this.#socket = new WebSocket(this.#config.prefixURL);
        this.#api = this.#scaffold(structure);
    }

    get api() {
        return this.#api;
    }

    async init() {
        const self = this;
        return new Promise((resolve) => {
            self.#socket.addEventListener("open", () => resolve(self));
        });
    }

    #scaffold = (structure) => {
        const api = {};
        const services = Object.keys(structure);
        for (const serviceName of services) {
            api[serviceName] = {};
            const service = structure[serviceName];
            const methods = Object.keys(service);
            for (const methodName of methods) {
                api[serviceName][methodName] = (data) => new Promise((resolve) => {
                    const packet = {
                        name: serviceName,
                        method: methodName,
                        data
                    };
                    this.#socket.send(JSON.stringify(packet));
                    this.#socket.onmessage = (event) => {
                        const response = new Response(event.data);
                        resolve(response);
                    };
                });
            }
        }
        return api;
    };
}
