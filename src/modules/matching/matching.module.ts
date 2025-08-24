import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MatchModule } from "../match/match.module";
import { NotificationModule } from "../notification/notification.module";
import { Project } from "../project/entities/project.entity";
import { Vendor } from "../vendor/entities/vendor.entity";
import { MatchingController } from "./matching.controller";
import { MatchingService } from "./matching.service";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Vendor]), MatchModule, NotificationModule],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
