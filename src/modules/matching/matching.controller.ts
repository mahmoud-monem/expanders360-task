import { Controller, Param, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { MatchingService } from "./matching.service";

@Controller("projects")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post(":id/matches/rebuild")
  @Roles(UserRole.Admin, UserRole.Client)
  async rebuildMatches(@Param("id") id: string) {
    await this.matchingService.rebuildMatches(+id);
    return { message: `Matches rebuilt for project ${id}` };
  }
}
