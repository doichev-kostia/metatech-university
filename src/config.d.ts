export declare const databaseConfig: {
  host: string,
  port: number,
  database: string,
  user: string,
  password: string,
};

export declare const saltLength: number;
export declare const passwordKeyLength: number;

export declare const ports: {
  api: number,
  static: number
};

export declare const transportOptions:  ["http", "ws"];

export type Transport = typeof transportOptions[number];
export declare const transport: Transport;
