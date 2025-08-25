import { Brackets } from "typeorm";

import { PaginatedRepository } from "src/common/repositories/paginated-repository";

import { GetCountriesPaginatedListQueryDto } from "../dtos/get-countries-list.query.dto";
import { Country } from "../entities/country.entity";

export class CountryRepository extends PaginatedRepository<Country> {
  async getCountriesPaginatedList(query: GetCountriesPaginatedListQueryDto) {
    const qb = this.createQueryBuilder("country");

    if (query.filters.isoCode) {
      qb.andWhere("country.isoCode = :isoCode", { isoCode: query.filters.isoCode });
    }

    if (query.search) {
      qb.andWhere(
        new Brackets(qb => {
          qb.where("country.name ILIKE :search", { search: `%${query.search}%` });
        }),
      );
    }

    return this.paginateQb(qb, query);
  }
}
