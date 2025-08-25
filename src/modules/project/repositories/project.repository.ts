import { SelectQueryBuilder } from "typeorm";

import { PaginatedRepository } from "src/common/repositories/paginated-repository";

import { GetProjectsPaginatedListQueryDto } from "../dtos/get-projects-paginated-list.query.dto";
import { Project } from "../entities/project.entity";

export class ProjectRepository extends PaginatedRepository<Project> {
  async getProjectDetails(id: number) {
    return this.getBaseQuery().where("project.id = :id", { id }).getOne();
  }

  async getProjectsPaginatedList(query: GetProjectsPaginatedListQueryDto) {
    const qb = this.getBaseQuery();

    this.applyFilters(qb, query);

    return this.paginateQb(qb, query);
  }

  private applyFilters(qb: SelectQueryBuilder<Project>, query: GetProjectsPaginatedListQueryDto) {
    if (query.filters.clientId) {
      qb.andWhere("project.clientId = :clientId", { clientId: query.filters.clientId });
    }

    if (query.filters.countryId) {
      qb.andWhere("project.countryId = :countryId", { countryId: query.filters.countryId });
    }

    if (query.filters.neededServices) {
      qb.andWhere("project.neededServices && :neededServices", { neededServices: query.filters.neededServices });
    }

    if (query.filters.status) {
      qb.andWhere("project.status = :status", { status: query.filters.status });
    }

    if (query.search) {
      qb.andWhere("(project.neededServices::text ILIKE :search OR project.budget::text ILIKE :search)", {
        search: `%${query.search}%`,
      });
    }
  }

  private getBaseQuery() {
    return this.createQueryBuilder("project")
      .leftJoinAndSelect("project.client", "client")
      .leftJoinAndSelect("project.country", "country");
  }
}
