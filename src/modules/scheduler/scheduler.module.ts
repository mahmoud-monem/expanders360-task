import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MatchingModule } from "../matching/matching.module";
import { NotificationModule } from "../notification/notification.module";
import { ProjectModule } from "../project/project.module";
import { Vendor } from "../vendor/entities/vendor.entity";
import { VendorModule } from "../vendor/vendor.module";
import { SchedulerService } from "./scheduler.service";

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forFeature([Vendor]),
    ProjectModule,
    VendorModule,
    MatchingModule,
    NotificationModule,
  ],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
