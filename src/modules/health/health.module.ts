import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";

import { ResearchDocument, ResearchDocumentSchema } from "../research-document/schemas/research-document.schema";
import { User } from "../user/entities/user.entity";
import { HealthController } from "./health.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    MongooseModule.forFeature([{ name: ResearchDocument.name, schema: ResearchDocumentSchema }]),
  ],
  controllers: [HealthController],
})
export class HealthModule {}
