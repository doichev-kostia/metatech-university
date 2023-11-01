export class Client {
    #api;
    #config;

    /**
     *
     * @param {Record<string, Record<string, string[]>>} structure
     * @param {{
     *   prefixURL: string,
     *   throwOnError: boolean
     * }}options
     */
    constructor(structure, options) {
        const config = { ...options };
        if (config.prefixURL && !(config.prefixURL.endsWith("/"))) {
            config.prefixURL += "/";
        }
        this.#config = config;
        this.#api = this.#scaffold(structure);
    }

    get api() {
        return this.#api;
    }

    async init() {
        return Promise.resolve(this);
    }

    /**
     *
     * @param {string} url
     * @param { RequestInit } init
     */
    async #request(url, init) {
        if (url.startsWith("/")) {
            url = url.slice(1);
        }

        const input = this.#config.prefixURL + url;
        const response = await fetch(input, init);

        if (!response.ok && this.#config.throwOnError) {
            throw new Error(`HTTP ${response.status} ${response.statusText}. ${await response.text()}`);
        }

        return response;
    }

    #scaffold(structure) {
        const api = {};
        const services = Object.keys(structure);
        for (const serviceName of services) {
            api[serviceName] = {};
            const service = structure[serviceName];
            const methods = Object.keys(service);
            for (const methodName of methods) {
                api[serviceName][methodName] = async (data) => {
                    return await this.#request(`${serviceName}/${methodName}`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(data),
                    });
                };
            }
        }
        return api;
    }
}
