/**
 *
 * @param {Record<string, Record<string, {
 *   parameters: string[],
 *
 * }>>} structure
 * @param {{
 *   prefixURL: string,
 *   throwOnError: boolean
 * }} config
 */
function scaffold(structure, config) {
  const options = {
    prefixURL: config.prefixURL || "",
    throwOnError: config.throwOnError || false,
  };

  if (!options.prefixURL.endsWith("/")) {
    options.prefixURL += "/";
  }

  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      const method = service[methodName];
      api[serviceName][methodName] = async (...args) => {
        const hasId = method.at(0) === "id";

        if (args.length !== method.length) {
          throw new Error(`Expected ${method.length} arguments, got ${args.length}`);
        }
        let parameters = [...args];
        let input = options.prefixURL + serviceName;
        if (hasId) {
          input += `/${parameters.shift()}`;
        }

        const [body] = parameters;

        const response = await fetch(input, {
          method: methodName.toUpperCase(),
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });

        if (!response.ok && options.throwOnError) {
          throw new Error(`HTTP ${response.status} ${response.statusText}. ${await response.text()}`);
        }

        return response;
      };
    }
  }
  return api;
}

export const api = scaffold({
  user: {
    create: ["record"],
    read: ["id"],
    update: ["id", "record"],
    delete: ["id"],
    find: ["mask"],
  },
  country: {
    read: ["id"],
    delete: ["id"],
    find: ["mask"],
  },
}, {
  prefixURL: "http://localhost:8080",
});



