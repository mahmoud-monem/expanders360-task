/**
 * with latest typeorm version it required to include "dataSource" option for creating and generating migrations
 *
 * @see https://github.com/typeorm/typeorm/issues/8810
 */
import { DataSource, DataSourceOptions } from "typeorm";

import { getDatabaseConfig } from "./database-orm.config";
import { SnakeCaseNamingStrategy } from "./strategies/snake-naming.strategy";

const options: DataSourceOptions = {
  type: "postgres",
  entities: ["src/**/*.entity.ts"],
  synchronize: false,
  namingStrategy: new SnakeCaseNamingStrategy(),
  migrations: ["src/**/migrations/**/*.ts"],
  ...getDatabaseConfig(),
};

export default new DataSource(options);
