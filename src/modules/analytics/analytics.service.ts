import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { InjectRepository } from "@nestjs/typeorm";
import { Model } from "mongoose";
import { Repository } from "typeorm";

import { MatchService } from "../match/match.service";
import { ProjectService } from "../project/project.service";
import { ResearchDocument, ResearchDocumentDocument } from "../research-document/schemas/research-document.schema";
import { Vendor } from "../vendor/entities/vendor.entity";

export interface TopVendorAnalytics {
  country: string;
  topVendors: {
    vendor: Vendor;
    averageScore: number;
  }[];
  researchDocumentCount: number;
}

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Vendor) private readonly vendorRepository: Repository<Vendor>,
    @InjectModel(ResearchDocument.name) private readonly researchDocumentModel: Model<ResearchDocumentDocument>,
    private readonly matchService: MatchService,
    private readonly projectService: ProjectService,
  ) {}

  async getTopVendorsByCountry(): Promise<TopVendorAnalytics[]> {
    // Get all unique countries from projects
    const countries = await this.getUniqueCountries();

    const analytics: TopVendorAnalytics[] = [];

    for (const country of countries) {
      const topVendors = await this.getTopVendorsForCountry(country);
      const researchDocumentCount = await this.getResearchDocumentCountForCountry(country);

      analytics.push({
        country,
        topVendors,
        researchDocumentCount,
      });
    }

    return analytics;
  }

  private async getUniqueCountries(): Promise<string[]> {
    const projects = await this.projectService.findAll();
    const countries = [...new Set(projects.map(project => project.country.name))];
    return countries;
  }

  private async getTopVendorsForCountry(country: string): Promise<{ vendor: Vendor; averageScore: number }[]> {
    // Get all vendors that support this country
    const vendors = await this.vendorRepository
      .createQueryBuilder("vendor")
      .where("JSON_CONTAINS(vendor.countries_supported, :country)", { country: JSON.stringify(country) })
      .getMany();

    const vendorScores: { vendor: Vendor; averageScore: number }[] = [];

    for (const vendor of vendors) {
      const averageScore = await this.matchService.getAverageScoreByVendorAndCountry(vendor.id, country, 30);

      if (averageScore > 0) {
        vendorScores.push({
          vendor,
          averageScore,
        });
      }
    }

    // Sort by average score descending and take top 3
    return vendorScores.sort((a, b) => b.averageScore - a.averageScore).slice(0, 3);
  }

  private async getResearchDocumentCountForCountry(country: string): Promise<number> {
    // This requires cross-DB query: find projects in this country, then count research documents for those projects
    const projects = await this.projectService.findAll();
    const projectsInCountry = projects.filter(project => project.country.name === country);
    const projectIds = projectsInCountry.map(project => project.id);

    if (projectIds.length === 0) {
      return 0;
    }

    return this.researchDocumentModel.countDocuments({
      projectId: { $in: projectIds },
    });
  }

  async getVendorPerformanceMetrics(vendorId: number, days: number = 30): Promise<any> {
    const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });

    if (!vendor) {
      throw new Error(`Vendor with ID ${vendorId} not found`);
    }

    const matches = await this.matchService.findByVendor(vendorId);
    const recentMatches = matches.filter(match => {
      const daysDiff = (new Date().getTime() - new Date(match.createdAt).getTime()) / (1000 * 3600 * 24);
      return daysDiff <= days;
    });

    const averageScore =
      recentMatches.length > 0 ? recentMatches.reduce((sum, match) => sum + match.score, 0) / recentMatches.length : 0;

    const countriesServed = [...new Set(recentMatches.map(match => match.project?.country).filter(Boolean))];

    return {
      vendor,
      totalMatches: matches.length,
      recentMatches: recentMatches.length,
      averageScore: Math.round(averageScore * 100) / 100,
      countriesServed,
      rating: vendor.rating,
      responseSlaHours: vendor.responseSlaHours,
    };
  }
}
