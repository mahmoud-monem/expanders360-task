import { Provider, Type } from "@nestjs/common";
import { getDataSourceToken } from "@nestjs/typeorm";
import {
  DataSource,
  DataSourceOptions,
  ObjectLiteral,
  ObjectType,
  Repository,
} from "typeorm";

/**
 * Provides custom repository
 *
 * @param {ObjectLiteral} entity - Entity
 * @param {Repository} repository - Repository
 * @param {DataSource | DataSourceOptions | string} dataSource - Data source
 * @returns {Provider} - Provider for custom repository
 */
export function provideCustomRepository<
  Entity extends ObjectLiteral,
  Repo extends Repository<Entity>,
>(
  entity: ObjectType<Entity>,
  repository: Type<Repo>,
  dataSource?: DataSource | DataSourceOptions | string,
): Provider {
  return {
    provide: repository,
    inject: [getDataSourceToken(dataSource)],
    useFactory: (dataSource: DataSource) => {
      const baseRepository = dataSource.getRepository(entity);

      return new repository(
        baseRepository.target,
        baseRepository.manager,
        baseRepository.queryRunner,
      );
    },
  };
}
