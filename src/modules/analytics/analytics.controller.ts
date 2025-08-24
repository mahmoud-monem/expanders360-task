import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { AnalyticsService } from "./analytics.service";

@Controller("analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("top-vendors")
  async getTopVendors() {
    return this.analyticsService.getTopVendorsByCountry();
  }

  @Get("vendor-performance/:vendorId")
  async getVendorPerformance(@Param("vendorId") vendorId: string, @Query("days") days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getVendorPerformanceMetrics(+vendorId, daysNumber);
  }
}
