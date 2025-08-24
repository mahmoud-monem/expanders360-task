import { Controller, Get } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { InjectRepository } from "@nestjs/typeorm";
import { Model } from "mongoose";
import { Repository } from "typeorm";

import { ResearchDocument, ResearchDocumentDocument } from "../research-document/schemas/research-document.schema";
import { User } from "../user/entities/user.entity";

@Controller("health")
export class HealthController {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectModel(ResearchDocument.name) private readonly researchDocumentModel: Model<ResearchDocumentDocument>,
  ) {}

  @Get()
  async checkHealth() {
    try {
      // Test MySQL connection
      const userCount = await this.userRepository.count();

      // Test MongoDB connection
      const docCount = await this.researchDocumentModel.estimatedDocumentCount();

      return {
        status: "ok",
        timestamp: new Date().toISOString(),
        services: {
          mysql: { status: "connected", userCount },
          mongodb: { status: "connected", documentCount: docCount },
        },
      };
    } catch (error) {
      return {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error.message,
      };
    }
  }
}
