export function httpRouting(routes, url) {
    const [name, method] = url.substring(1).split("/");
    const entity = routes[name];

    if (!entity) throw new NotFound(`Entity ${name} not found`);

    const handler = entity[method];

    if (!handler) throw new NotFound(`Method ${method} not found`);

    return handler;
}

export class NotFound extends Error {
    constructor(message) {
        super(message);
        this.name = "NotFound";

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

