import { Injectable, NotFoundException } from "@nestjs/common";

import { StorageService } from "src/common/services/storage.service";

import { CreateResearchDocumentDto } from "./dtos/create-research-document.dto";
import { GetResearchDocumentsPaginatedListQueryDto } from "./dtos/get-research-documents-paginated-list.query.dto";
import { UpdateResearchDocumentDto } from "./dtos/update-research-document.dto";
import { PaginatedResult, ResearchDocumentRepository } from "./repositories/research-document.repository";
import { ResearchDocument } from "./schemas/research-document.schema";

@Injectable()
export class ResearchDocumentService {
  constructor(
    private readonly researchDocumentRepository: ResearchDocumentRepository,
    private readonly storageService: StorageService,
  ) {}

  async create(createResearchDocumentDto: CreateResearchDocumentDto, file?: Express.Multer.File): Promise<ResearchDocument> {
    let fileData = {};

    if (file) {
      const fileKey = this.storageService.generateFileKey(file.originalname, createResearchDocumentDto.projectId);
      const fileUrl = await this.storageService.uploadFile(file, fileKey);

      fileData = {
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    }

    const documentData = {
      ...createResearchDocumentDto,
      ...fileData,
    };

    return this.researchDocumentRepository.create(documentData);
  }

  async getResearchDocumentsPaginatedList(
    query: GetResearchDocumentsPaginatedListQueryDto,
  ): Promise<PaginatedResult<ResearchDocument>> {
    return this.researchDocumentRepository.getResearchDocumentsPaginatedList(query);
  }

  async getResearchDocumentDetails(id: string): Promise<ResearchDocument> {
    return this.validateResearchDocumentExistence(id);
  }

  async findAll(): Promise<ResearchDocument[]> {
    return this.researchDocumentRepository.findAll();
  }

  async findOne(id: string): Promise<ResearchDocument> {
    const document = await this.researchDocumentRepository.findById(id);

    if (!document) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }

    return document;
  }

  async findByProject(projectId: number): Promise<ResearchDocument[]> {
    return this.researchDocumentRepository.findByProject(projectId);
  }

  async countByCountryAndProjectType(country: string): Promise<number> {
    return 0;
  }

  async update(
    id: string,
    updateResearchDocumentDto: UpdateResearchDocumentDto,
    file?: Express.Multer.File,
  ): Promise<ResearchDocument> {
    const existingDocument = await this.validateResearchDocumentExistence(id);

    let fileData = {};

    if (file) {
      if (existingDocument.fileUrl) {
        try {
          const oldFileKey = this.extractFileKeyFromUrl(existingDocument.fileUrl);
          await this.storageService.deleteFile(oldFileKey);
        } catch (error) {
          console.warn(`Failed to delete old file: ${error.message}`);
        }
      }

      const fileKey = this.storageService.generateFileKey(file.originalname, existingDocument.projectId);
      const fileUrl = await this.storageService.uploadFile(file, fileKey);

      fileData = {
        fileUrl,
        fileName: file.originalname,
        fileSize: file.size,
        mimeType: file.mimetype,
      };
    }

    const updateData = {
      ...updateResearchDocumentDto,
      ...fileData,
    };

    const document = await this.researchDocumentRepository.update(id, updateData);

    if (!document) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }

    return document;
  }

  async remove(id: string): Promise<{ message: string }> {
    const document = await this.validateResearchDocumentExistence(id);

    if (document.fileUrl) {
      try {
        const fileKey = this.extractFileKeyFromUrl(document.fileUrl);
        await this.storageService.deleteFile(fileKey);
      } catch (error) {
        console.warn(`Failed to delete file from storage: ${error.message}`);
      }
    }

    const result = await this.researchDocumentRepository.delete(id);

    if (!result) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }

    return { message: "Research document deleted successfully" };
  }

  private async validateResearchDocumentExistence(id: string): Promise<ResearchDocument> {
    const document = await this.researchDocumentRepository.getResearchDocumentDetails(id);

    if (!document) {
      throw new NotFoundException(`Research document with ID ${id} not found`);
    }

    return document;
  }

  private extractFileKeyFromUrl(fileUrl: string): string {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    return pathParts.slice(2).join("/");
  }
}
