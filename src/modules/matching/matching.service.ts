import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { MatchService } from "../match/match.service";
import { NotificationService } from "../notification/notification.service";
import { Project } from "../project/entities/project.entity";
import { Vendor } from "../vendor/entities/vendor.entity";

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(Vendor) private readonly vendorRepository: Repository<Vendor>,
    private readonly matchService: MatchService,
    private readonly notificationService: NotificationService,
  ) {}

  // async rebuildMatches(projectId: number): Promise<void> {
  //   // Remove existing matches for this project
  //   await this.matchService.removeByProject(projectId);

  //   // Find the project
  //   const project = await this.projectRepository.findOne({
  //     where: { id: projectId },
  //   });

  //   if (!project) {
  //     throw new Error(`Project with ID ${projectId} not found`);
  //   }

  //   // Find eligible vendors based on matching rules
  //   const vendors = await this.findEligibleVendors(project.country, project.servicesNeeded);

  //   // Calculate scores and create matches
  //   for (const vendor of vendors) {
  //     const score = this.calculateMatchScore(project, vendor);

  //     const match = await this.matchService.upsert({
  //       projectId: project.id,
  //       vendorId: vendor.id,
  //       score,
  //     });

  //     // Send notification for new match
  //     try {
  //       const matchWithRelations = await this.matchService.findOne(match.id);
  //       await this.notificationService.sendNewMatchNotification(matchWithRelations);
  //     } catch (error) {
  //       console.error("Failed to send notification for match:", error);
  //     }
  //   }
  // }

  // private async findEligibleVendors(country: string, servicesNeeded: ServiceType[]): Promise<Vendor[]> {
  //   return this.vendorRepository
  //     .createQueryBuilder("vendor")
  //     .where("JSON_CONTAINS(vendor.countries_supported, :country)", { country: JSON.stringify(country) })
  //     .andWhere("JSON_OVERLAPS(vendor.services_offered, :services)", { services: JSON.stringify(servicesNeeded) })
  //     .getMany();
  // }

  // private calculateMatchScore(project: Project, vendor: Vendor): number {
  //   // Matching rules:
  //   // - Vendors must cover same country (already filtered)
  //   // - At least one service overlap (already filtered)
  //   // - Score formula: services_overlap * 2 + rating + SLA_weight

  //   const servicesOverlap = this.calculateServicesOverlap(project.servicesNeeded, vendor.servicesOffered);
  //   const slaWeight = this.calculateSlaWeight(vendor.responseSlaHours);

  //   const score = servicesOverlap * 2 + vendor.rating + slaWeight;

  //   return Math.round(score * 100) / 100; // Round to 2 decimal places
  // }

  // private calculateServicesOverlap(projectServices: ServiceType[], vendorServices: ServiceType[]): number {
  //   const overlap = projectServices.filter(service => vendorServices.includes(service));
  //   return overlap.length;
  // }

  // private calculateSlaWeight(slaHours: number): number {
  //   // Give higher weight to faster response times
  //   // 24 hours or less = 5 points
  //   // 48 hours = 3 points
  //   // 72 hours = 1 point
  //   // More than 72 hours = 0 points
  //   if (slaHours <= 24) return 5;
  //   if (slaHours <= 48) return 3;
  //   if (slaHours <= 72) return 1;
  //   return 0;
  // }
}
