import { Injectable } from "@nestjs/common";

import { PaginatedRepository } from "src/common/repositories/paginated-repository";

import { User } from "../entities/user.entity";

@Injectable()
export class UserRepository extends PaginatedRepository<User> {
  async getUserDetails(id: string) {
    return this.getBaseQuery().where("user.id = :id", { id }).getOne();
  }

  private getBaseQuery() {
    return this.createQueryBuilder("user");
  }
}
