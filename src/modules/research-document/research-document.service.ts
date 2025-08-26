import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { StorageService } from "src/common/services/storage.service";

import { Project } from "../project/entities/project.entity";
import { UserRole } from "../user/constants/user-role.enum";
import { User } from "../user/entities/user.entity";
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
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
  ) {}

  async create(
    createResearchDocumentDto: CreateResearchDocumentDto,
    file?: Express.Multer.File,
    user?: User,
  ): Promise<ResearchDocument> {
    // If user is client, validate they own the project
    if (user && user.role === UserRole.Client) {
      await this.validateProjectOwnership(createResearchDocumentDto.projectId, user);
    }

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
    user?: User,
  ): Promise<PaginatedResult<ResearchDocument>> {
    // If user is client, we need to pass their user ID to the repository
    // so it can filter documents by projects they own
    let clientId: number | undefined;
    if (user && user.role === UserRole.Client) {
      clientId = user.id;
    }
    return this.researchDocumentRepository.getResearchDocumentsPaginatedList(query, clientId);
  }

  async getResearchDocumentDetails(id: string, user?: User): Promise<ResearchDocument> {
    const document = await this.validateResearchDocumentExistence(id);

    // If user is client, validate they own the project this document belongs to
    if (user && user.role === UserRole.Client) {
      await this.validateProjectOwnership(document.projectId, user);
    }

    return document;
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
    user?: User,
  ): Promise<ResearchDocument> {
    const existingDocument = await this.validateResearchDocumentExistence(id);

    // If user is client, validate they own the project this document belongs to
    if (user && user.role === UserRole.Client) {
      await this.validateProjectOwnership(existingDocument.projectId, user);
    }

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

  async remove(id: string, user?: User): Promise<{ message: string }> {
    const document = await this.validateResearchDocumentExistence(id);

    // If user is client, validate they own the project this document belongs to
    if (user && user.role === UserRole.Client) {
      await this.validateProjectOwnership(document.projectId, user);
    }

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

  private async validateProjectOwnership(projectId: number, user: User): Promise<void> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }

    if (project.clientId !== user.id) {
      throw new ForbiddenException("You can only access documents for your own projects");
    }
  }

  private extractFileKeyFromUrl(fileUrl: string): string {
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split("/");
    return pathParts.slice(2).join("/");
  }
}
