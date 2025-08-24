import { MysqlConnectionOptions } from "typeorm/driver/mysql/MysqlConnectionOptions";

import { appConfig } from "../src/common/config/app.config";

/**
 * Get database config
 */
export function getDatabaseConfig(): Partial<MysqlConnectionOptions> {
  const options: Partial<MysqlConnectionOptions> = {};

  Object.assign(options, {
    host: appConfig.DB_HOST,
    port: appConfig.DB_PORT,
    username: appConfig.DB_USERNAME,
    password: appConfig.DB_PASSWORD,
    database: appConfig.DB_NAME,
  });

  if (appConfig.DB_SSL) {
    Object.assign(options, {
      ssl: {
        rejectUnauthorized: false,
      },
    });
  }

  return options;
}
