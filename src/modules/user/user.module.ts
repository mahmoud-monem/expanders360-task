import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { provideCustomRepository } from "src/common/providers/custom-repository.provider";

import { User } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, provideCustomRepository(User, UserRepository)],
  controllers: [UserController],
})
export class UserModule {}
