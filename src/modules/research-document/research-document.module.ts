import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { StorageService } from "src/common/services/storage.service";

import { ResearchDocumentRepository } from "./repositories/research-document.repository";
import { ResearchDocumentController } from "./research-document.controller";
import { ResearchDocumentService } from "./research-document.service";
import { ResearchDocument, ResearchDocumentSchema } from "./schemas/research-document.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: ResearchDocument.name, schema: ResearchDocumentSchema }])],
  controllers: [ResearchDocumentController],
  providers: [ResearchDocumentService, ResearchDocumentRepository, StorageService],
  exports: [ResearchDocumentService],
})
export class ResearchDocumentModule {}
