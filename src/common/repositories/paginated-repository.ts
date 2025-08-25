import {
  IPaginationMeta,
  IPaginationOptions,
  Pagination,
  PaginationTypeEnum,
  TypeORMCacheType,
  paginate,
  paginateRaw,
  paginateRawAndEntities,
} from "nestjs-typeorm-paginate";
import { FindManyOptions, ObjectLiteral, Repository, SelectQueryBuilder } from "typeorm";

import { DEFAULT_PER_PAGE } from "../dtos/pagination.query.dto";

/**
 * Repository that provides pagination functionality for entities that extend it,
 * using the nestjs-typeorm-paginate library.
 *
 * @template T - The type of the entity being paginated.
 */
export class PaginatedRepository<T extends ObjectLiteral> extends Repository<T> {
  /**
   * Paginates a list of entities that extend this repository.
   *
   * @param {IPaginationOptions} options - The pagination options.
   * @param {FindManyOptions} [filter] - The filter used to query the entity.
   * @returns {Promise<Pagination<T, IPaginationMeta>>} - The paginated list of items.
   * @template T - The type of the entity to paginate.
   */
  public paginate(options: IPaginationOptions, filter?: FindManyOptions<T>): Promise<Pagination<T, IPaginationMeta>> {
    return paginate(this, options, filter);
  }

  /**
   * Paginates a list of entities using a custom `SelectQueryBuilder`.
   *
   * @param {SelectQueryBuilder<T>} queryBuilder - The `SelectQueryBuilder` to use for the query.
   * @param {IPaginationOptions} options - The pagination options.
   * @returns {Promise<Pagination<T, IPaginationMeta>>} - The paginated list of items.
   * @template T - The type of the entity to paginate.
   */
  public async paginateQb(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
  ): Promise<Pagination<T, IPaginationMeta>> {
    const limit = this.validateInputLimit(options.limit);
    const cacheOption = this.getCacheOption(options);

    const qbDefaultOptions: Partial<IPaginationOptions> = {
      paginationType: PaginationTypeEnum.TAKE_AND_SKIP,
      countQueries: false,
    };
    const mergedOptions = { ...qbDefaultOptions, ...options, limit };
    const [partialResult, totalItems] = await Promise.all([
      paginate(queryBuilder, mergedOptions),
      queryBuilder.cache(cacheOption).getCount(),
    ]);

    return {
      items: partialResult.items,
      meta: {
        ...partialResult.meta,
        totalItems,
        totalPages: this.getTotalPages(totalItems, limit),
      },
    };
  }

  /**
   * Paginates a list of entities using a custom `SelectQueryBuilder` for raw results.
   *
   * @param {SelectQueryBuilder<T>} queryBuilder - The `SelectQueryBuilder` to use for the query.
   * @param {IPaginationOptions} options - The pagination options.
   * @returns {Promise<Pagination<V, IPaginationMeta>>>} - The paginated list of items.
   * @template V - The expected response type
   * @template T - The current entity
   */
  public paginateRaw<V extends ObjectLiteral = T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
  ): Promise<Pagination<V, IPaginationMeta>> {
    return paginateRaw<V>(queryBuilder as unknown as SelectQueryBuilder<V>, options);
  }

  /**
   * Paginates a list of entities using a custom `SelectQueryBuilder` for raw and entity results.
   *
   * @param {SelectQueryBuilder<T>} queryBuilder - The `SelectQueryBuilder` to use for the query.
   * @param {IPaginationOptions} options - The pagination options.
   * @returns {Promise<Pagination<V, IPaginationMeta>>>} - The paginated list of items.
   * @template V - The expected response type
   * @template T - The current entity
   */
  public paginateRawAndEntities<V extends ObjectLiteral = T>(
    queryBuilder: SelectQueryBuilder<T>,
    options: IPaginationOptions,
  ): Promise<[Pagination<V, IPaginationMeta>, Partial<V>[]]> {
    return paginateRawAndEntities<V, IPaginationMeta>(queryBuilder as unknown as SelectQueryBuilder<V>, options);
  }

  /**
   * provide totalPages for metadata - override with correct totalItems
   *
   * @param {number} totalItems - all results (not paginated)
   * @param {number} limit - query limit
   * @returns {number} total number of pages we can fetch
   */
  private getTotalPages(totalItems: number, limit: number): number {
    return Math.ceil(totalItems / limit);
  }

  private getCacheOption(options: IPaginationOptions): TypeORMCacheType {
    return options.cacheQueries || false;
  }

  /**
   * Sanitize the input.limit value and provide default if needed
   *
   * @param {string | number} value - limit value provided in input options
   * @returns {number} either parsed value or default value as it is set in base-api
   */
  private validateInputLimit(value: string | number): number {
    const numericValue = Number(value);

    if (Number.isInteger(numericValue) && numericValue > 0) {
      return numericValue;
    }
    return DEFAULT_PER_PAGE;
  }
}
