import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { CreateResearchDocumentDto } from "./dto/create-research-document.dto";
import { SearchResearchDocumentDto } from "./dto/search-research-document.dto";
import { UpdateResearchDocumentDto } from "./dto/update-research-document.dto";
import { ResearchDocument, ResearchDocumentDocument } from "./schemas/research-document.schema";

@Injectable()
export class ResearchDocumentService {
  constructor(@InjectModel(ResearchDocument.name) private researchDocumentModel: Model<ResearchDocumentDocument>) {}

  async create(createResearchDocumentDto: CreateResearchDocumentDto): Promise<ResearchDocument> {
    const document = new this.researchDocumentModel(createResearchDocumentDto);
    return document.save();
  }

  async findAll(): Promise<ResearchDocument[]> {
    return this.researchDocumentModel.find().exec();
  }

  async findOne(id: string): Promise<ResearchDocument> {
    const document = await this.researchDocumentModel.findById(id).exec();

    if (!document) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }

    return document;
  }

  async findByProject(projectId: number): Promise<ResearchDocument[]> {
    return this.researchDocumentModel.find({ projectId }).exec();
  }

  async search(searchDto: SearchResearchDocumentDto): Promise<ResearchDocument[]> {
    const query: any = {};

    if (searchDto.projectId) {
      query.projectId = searchDto.projectId;
    }

    if (searchDto.tags && searchDto.tags.length > 0) {
      query.tags = { $in: searchDto.tags };
    }

    if (searchDto.text) {
      query.$or = [{ title: { $regex: searchDto.text, $options: "i" } }, { content: { $regex: searchDto.text, $options: "i" } }];
    }

    return this.researchDocumentModel.find(query).exec();
  }

  async countByCountryAndProjectType(country: string): Promise<number> {
    // This would need additional logic to link projects to expansion type
    // For now, count documents for projects in the specified country
    // This requires a join/aggregation with the MySQL projects data
    // Implementation would depend on how you want to handle cross-DB queries
    return 0; // Placeholder
  }

  async update(id: string, updateResearchDocumentDto: UpdateResearchDocumentDto): Promise<ResearchDocument> {
    const document = await this.researchDocumentModel.findByIdAndUpdate(id, updateResearchDocumentDto, { new: true }).exec();

    if (!document) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }

    return document;
  }

  async remove(id: string): Promise<void> {
    const result = await this.researchDocumentModel.findByIdAndDelete(id).exec();

    if (!result) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }
  }
}
