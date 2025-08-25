import { Injectable, NotFoundException } from "@nestjs/common";

import { UserRepository } from "./repositories/user.repository";

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async getUserDetails(id: string) {
    const user = await this.userRepository.getUserDetails(id);

    if (!user) {
      throw new NotFoundException("User not found");
    }

    return user;
  }
}
