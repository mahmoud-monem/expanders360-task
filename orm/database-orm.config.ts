import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

import { appConfig } from "../src/common/config/app.config";

/**
 * Get database config
 */
export function getDatabaseConfig(): Partial<PostgresConnectionOptions> {
  const options: Partial<PostgresConnectionOptions> = {};

  Object.assign(options, {
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    username: appConfig.DB_USERNAME,
    password: appConfig.DB_PASSWORD,
    database: appConfig.DB_NAME,
  });

  if (process.env.DB_SSL) {
    Object.assign(options, {
      ssl: true,
      extra: {
        ssl: {
          rejectUnauthorized: false,
        },
      },
    });
  }

  return options;
}
