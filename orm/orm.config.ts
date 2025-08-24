import { TypeOrmModuleOptions } from "@nestjs/typeorm";

import { getDatabaseConfig } from "./database-orm.config";
import { SnakeCaseNamingStrategy } from "./strategies/snake-naming.strategy";

/**
 * Initialize orm config
 */
export const initOrmConfig = (): TypeOrmModuleOptions => {
  return {
    type: "postgres",
    synchronize: false,
    autoLoadEntities: true,
    entities: ["dist/**/*.entity{.ts,.js}"],
    namingStrategy: new SnakeCaseNamingStrategy(),
    ...getDatabaseConfig(),
  };
};
