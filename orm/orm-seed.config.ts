import { DataSource, DataSourceOptions } from "typeorm";

import { getDatabaseConfig } from "./database-orm.config";
import { SnakeCaseNamingStrategy } from "./strategies/snake-naming.strategy";

const SEED_TABLE_NAME = "seeds";

const options: DataSourceOptions = {
  type: "postgres",
  entities: ["src/**/*.entity.ts"],
  synchronize: false,
  migrations: ["src/**/seeds/**/*.ts"],
  migrationsTableName: SEED_TABLE_NAME,
  namingStrategy: new SnakeCaseNamingStrategy(),
  ...getDatabaseConfig(),
};

export default new DataSource(options);
