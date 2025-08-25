import { SelectQueryBuilder } from "typeorm";

import { PaginatedRepository } from "src/common/repositories/paginated-repository";

import { GetVendorsPaginatedListQueryDto } from "../dtos/get-vendors-paginated-list.query.dto";
import { Vendor } from "../entities/vendor.entity";

export class VendorRepository extends PaginatedRepository<Vendor> {
  async getVendorDetails(id: number) {
    return this.getBaseQuery().where("vendor.id = :id", { id }).getOne();
  }

  async getVendorsPaginatedList(query: GetVendorsPaginatedListQueryDto) {
    const qb = this.getBaseQuery();

    this.applyFilters(qb, query);

    return this.paginateQb(qb, query);
  }

  private applyFilters(qb: SelectQueryBuilder<Vendor>, query: GetVendorsPaginatedListQueryDto) {
    console.log(query.filters);
    if (query.filters.supportedCountryId) {
      qb.andWhere("supportedCountry.id = :supportedCountryId", { supportedCountryId: query.filters.supportedCountryId });
    }

    if (query.filters.offeredServices) {
      qb.andWhere("vendor.offeredServices && :offeredServices", { offeredServices: query.filters.offeredServices });
    }

    if (query.search) {
      qb.andWhere("vendor.name ILIKE :search", { search: `%${query.search}%` });
    }
  }

  private getBaseQuery() {
    return this.createQueryBuilder("vendor").leftJoinAndSelect("vendor.supportedCountries", "supportedCountry");
  }
}
