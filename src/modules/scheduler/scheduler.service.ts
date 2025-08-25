import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { NotificationService } from "../notification/notification.service";
import { ProjectStatus } from "../project/constants/project-status.enum";
import { ProjectService } from "../project/project.service";
import { Vendor } from "../vendor/entities/vendor.entity";
import { VendorService } from "../vendor/vendor.service";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly projectService: ProjectService,
    private readonly vendorService: VendorService,
    private readonly notificationService: NotificationService,
    @InjectRepository(Vendor) private readonly vendorRepository: Repository<Vendor>,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async handleDailyMatchRefresh() {
    this.logger.log("Starting daily match refresh for active projects...");

    try {
      const activeProjects = await this.projectService.findActiveProjects();
      this.logger.log(`Found ${activeProjects.length} active projects to refresh matches for`);

      for (const project of activeProjects) {
        try {
          await this.projectService.rebuildMatches(project.id);
          this.logger.log(`Refreshed matches for project ${project.id}`);
        } catch (error) {
          this.logger.error(`Failed to refresh matches for project ${project.id}:`, error);
        }
      }

      this.logger.log("Daily match refresh completed");
    } catch (error) {
      this.logger.error("Daily match refresh failed:", error);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async handleSlaViolationCheck() {
    this.logger.log("Starting SLA violation check...");

    try {
      const vendors = await this.vendorService.getVendorsPaginatedList({
        page: 1,
        limit: 1000,
        filters: {},
      });
      const currentTime = new Date();
      const violatingVendors: any[] = [];

      for (const vendor of vendors.items) {
        const matches = await this.getRecentUnrespondedMatches(vendor.id);

        for (const match of matches) {
          const hoursSinceMatch = (currentTime.getTime() - new Date(match.createdAt).getTime()) / (1000 * 60 * 60);

          if (hoursSinceMatch > vendor.responseSlaHours) {
            violatingVendors.push({
              vendor,
              match,
              hoursSinceMatch: Math.round(hoursSinceMatch),
            });
          }
        }
      }

      this.logger.log(`Found ${violatingVendors.length} SLA violations`);

      for (const violation of violatingVendors) {
        try {
          await this.notificationService.sendSlaViolationNotification(violation.vendor);
          this.logger.log(`Sent SLA violation notification for vendor ${violation.vendor.name}`);
        } catch (error) {
          this.logger.error(`Failed to send SLA violation notification for vendor ${violation.vendor.name}:`, error);
        }
      }

      this.logger.log("SLA violation check completed");
    } catch (error) {
      this.logger.error("SLA violation check failed:", error);
    }
  }

  @Cron(CronExpression.EVERY_HOUR)
  async handleHealthCheck() {
    this.logger.log("Performing system health check...");

    try {
      const projectCount = await this.projectService.findAll();
      const vendorCount = await this.vendorService.getVendorsPaginatedList({
        page: 1,
        limit: 1,
        filters: {},
      });

      this.logger.log(`System health: ${projectCount.length} projects, ${vendorCount.meta.totalItems} vendors`);
    } catch (error) {
      this.logger.error("Health check failed:", error);
    }
  }

  private async getRecentUnrespondedMatches(vendorId: number) {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    return this.vendorRepository
      .createQueryBuilder("vendor")
      .leftJoinAndSelect("vendor.matches", "match")
      .leftJoinAndSelect("match.project", "project")
      .where("vendor.id = :vendorId", { vendorId })
      .andWhere("match.created_at > :sevenDaysAgo", { sevenDaysAgo })
      .andWhere("project.status = :status", { status: ProjectStatus.Active })
      .getOne()
      .then(vendor => vendor?.matches || []);
  }
}
