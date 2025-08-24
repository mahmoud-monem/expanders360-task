import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { MoreThan, Repository } from "typeorm";

import { CreateMatchDto } from "./dto/create-match.dto";
import { Match } from "./entities/match.entity";

@Injectable()
export class MatchService {
  constructor(@InjectRepository(Match) private readonly matchRepository: Repository<Match>) {}

  async create(createMatchDto: CreateMatchDto): Promise<Match> {
    const match = this.matchRepository.create(createMatchDto);
    return this.matchRepository.save(match);
  }

  async upsert(createMatchDto: CreateMatchDto): Promise<Match> {
    const existingMatch = await this.matchRepository.findOne({
      where: {
        projectId: createMatchDto.projectId,
        vendorId: createMatchDto.vendorId,
      },
    });

    if (existingMatch) {
      existingMatch.score = createMatchDto.score;
      return this.matchRepository.save(existingMatch);
    }

    return this.create(createMatchDto);
  }

  async findAll(): Promise<Match[]> {
    return this.matchRepository.find({
      relations: ["project", "vendor"],
    });
  }

  async findOne(id: number): Promise<Match> {
    const match = await this.matchRepository.findOne({
      where: { id },
      relations: ["project", "vendor"],
    });

    if (!match) {
      throw new NotFoundException(`Match with ID ${id} not found`);
    }

    return match;
  }

  async findByProject(projectId: number): Promise<Match[]> {
    return this.matchRepository.find({
      where: { projectId },
      relations: ["project", "vendor"],
      order: { score: "DESC" },
    });
  }

  async findByVendor(vendorId: number): Promise<Match[]> {
    return this.matchRepository.find({
      where: { vendorId },
      relations: ["project", "vendor"],
      order: { score: "DESC" },
    });
  }

  async findRecentMatches(days: number = 30): Promise<Match[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    return this.matchRepository.find({
      where: { createdAt: MoreThan(since) },
      relations: ["project", "vendor"],
    });
  }

  async getAverageScoreByVendorAndCountry(vendorId: number, country: string, days: number = 30): Promise<number> {
    const since = new Date();
    since.setDate(since.getDate() - days);

    const result = await this.matchRepository
      .createQueryBuilder("match")
      .leftJoinAndSelect("match.project", "project")
      .where("match.vendor_id = :vendorId", { vendorId })
      .andWhere("project.country = :country", { country })
      .andWhere("match.created_at > :since", { since })
      .select("AVG(match.score)", "averageScore")
      .getRawOne();

    return parseFloat(result?.averageScore) || 0;
  }

  async remove(id: number): Promise<void> {
    const match = await this.findOne(id);
    await this.matchRepository.remove(match);
  }

  async removeByProject(projectId: number): Promise<void> {
    await this.matchRepository.delete({ projectId });
  }
}
