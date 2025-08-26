import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { AnalyticsService } from "./analytics.service";
import { TopVendorsAnalyticsResponseDto } from "./dtos/top-vendors-analytics.response.dto";

@ApiTags("Analytics")
@Controller("analytics")
@UseGuards(JwtAuthGuard, RolesGuard)
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Get("top-vendors")
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiOperation({
    summary: "Get top 3 vendors per country with research document counts (Admin: full analytics, Client: read analytics)",
  })
  @ApiOkResponse({ type: [TopVendorsAnalyticsResponseDto] })
  @Serialize(TopVendorsAnalyticsResponseDto)
  async getTopVendors() {
    return this.analyticsService.getTopVendorsByCountry();
  }

  @Get("vendor-performance/:vendorId")
  @Roles(UserRole.Admin)
  @ApiOperation({ summary: "Get vendor performance metrics (Admin only)" })
  async getVendorPerformance(@Param("vendorId") vendorId: string, @Query("days") days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 30;
    return this.analyticsService.getVendorPerformanceMetrics(+vendorId, daysNumber);
  }
}
