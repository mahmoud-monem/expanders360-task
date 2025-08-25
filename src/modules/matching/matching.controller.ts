import { Controller, UseGuards } from "@nestjs/common";

import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { MatchingService } from "./matching.service";

@Controller("projects")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  // @Post(":id/matches/rebuild")
  // @Roles(UserRole.Admin, UserRole.Client)
  // async rebuildMatches(@Param("id") id: string) {
  //   await this.matchingService.rebuildMatches(+id);
  //   return { message: `Matches rebuilt for project ${id}` };
  // }
}
