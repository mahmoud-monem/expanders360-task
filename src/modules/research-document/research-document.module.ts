import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";

import { ResearchDocumentController } from "./research-document.controller";
import { ResearchDocumentService } from "./research-document.service";
import { ResearchDocument, ResearchDocumentSchema } from "./schemas/research-document.schema";

@Module({
  imports: [MongooseModule.forFeature([{ name: ResearchDocument.name, schema: ResearchDocumentSchema }])],
  controllers: [ResearchDocumentController],
  providers: [ResearchDocumentService],
  exports: [ResearchDocumentService],
})
export class ResearchDocumentModule {}
