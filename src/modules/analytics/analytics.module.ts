import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";

import { MatchModule } from "../match/match.module";
import { ProjectModule } from "../project/project.module";
import { ResearchDocument, ResearchDocumentSchema } from "../research-document/schemas/research-document.schema";
import { Vendor } from "../vendor/entities/vendor.entity";
import { AnalyticsController } from "./analytics.controller";
import { AnalyticsService } from "./analytics.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Vendor]),
    MongooseModule.forFeature([{ name: ResearchDocument.name, schema: ResearchDocumentSchema }]),
    MatchModule,
    ProjectModule,
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}
