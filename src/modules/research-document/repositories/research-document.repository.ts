import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { InjectRepository } from "@nestjs/typeorm";
import { Model } from "mongoose";
import { Repository } from "typeorm";

import { Project } from "../../project/entities/project.entity";
import { GetResearchDocumentsPaginatedListQueryDto } from "../dtos/get-research-documents-paginated-list.query.dto";
import { ResearchDocument, ResearchDocumentDocument } from "../schemas/research-document.schema";

export interface PaginatedResult<T> {
  items: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
}

@Injectable()
export class ResearchDocumentRepository {
  constructor(
    @InjectModel(ResearchDocument.name) private researchDocumentModel: Model<ResearchDocumentDocument>,
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
  ) {}

  async getResearchDocumentDetails(id: string): Promise<ResearchDocument | null> {
    return this.researchDocumentModel.findById(id).exec();
  }

  async getResearchDocumentsPaginatedList(
    query: GetResearchDocumentsPaginatedListQueryDto,
    clientId?: number,
  ): Promise<PaginatedResult<ResearchDocument>> {
    const { page = 1, limit = 10, search, filters } = query;
    const skip = (page - 1) * limit;

    const mongoQuery: any = {};

    if (filters.projectId) {
      mongoQuery.projectId = filters.projectId;
    }

    // If clientId is provided, filter documents to only those from client's projects
    if (clientId) {
      const clientProjects = await this.projectRepository.find({
        where: { clientId },
        select: ["id"],
      });
      const projectIds = clientProjects.map(p => p.id);

      if (projectIds.length === 0) {
        // Client has no projects, return empty result
        return {
          items: [],
          meta: {
            totalItems: 0,
            itemCount: 0,
            itemsPerPage: limit,
            totalPages: 0,
            currentPage: page,
          },
        };
      }

      mongoQuery.projectId = { $in: projectIds };
    }

    if (filters.tags && filters.tags.length > 0) {
      mongoQuery.tags = { $in: filters.tags };
    }

    if (filters.hasFile !== undefined) {
      if (filters.hasFile) {
        mongoQuery.fileUrl = { $exists: true, $ne: null };
      } else {
        mongoQuery.$or = [{ fileUrl: { $exists: false } }, { fileUrl: null }];
      }
    }

    if (search) {
      mongoQuery.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
        { tags: { $in: [new RegExp(search, "i")] } },
      ];
    }

    const [items, totalItems] = await Promise.all([
      this.researchDocumentModel.find(mongoQuery).skip(skip).limit(limit).sort({ createdAt: -1 }).exec(),
      this.researchDocumentModel.countDocuments(mongoQuery).exec(),
    ]);

    const totalPages = Math.ceil(totalItems / limit);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages,
        currentPage: page,
      },
    };
  }

  async create(createData: Partial<ResearchDocument>): Promise<ResearchDocument> {
    const document = new this.researchDocumentModel(createData);
    return document.save();
  }

  async findById(id: string): Promise<ResearchDocument | null> {
    return this.researchDocumentModel.findById(id).exec();
  }

  async findByProject(projectId: number): Promise<ResearchDocument[]> {
    return this.researchDocumentModel.find({ projectId }).sort({ createdAt: -1 }).exec();
  }

  async update(id: string, updateData: Partial<ResearchDocument>): Promise<ResearchDocument | null> {
    return this.researchDocumentModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
  }

  async delete(id: string): Promise<ResearchDocument | null> {
    return this.researchDocumentModel.findByIdAndDelete(id).exec();
  }

  async findAll(): Promise<ResearchDocument[]> {
    return this.researchDocumentModel.find().sort({ createdAt: -1 }).exec();
  }
}
