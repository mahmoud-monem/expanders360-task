import { Body, Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { CreateMatchDto } from "./dto/create-match.dto";
import { MatchService } from "./match.service";

@Controller("matches")
@UseGuards(JwtAuthGuard, RolesGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) {}

  @Post()
  @Roles(UserRole.Admin)
  create(@Body() createMatchDto: CreateMatchDto) {
    return this.matchService.create(createMatchDto);
  }

  @Get()
  @Roles(UserRole.Admin)
  findAll() {
    return this.matchService.findAll();
  }

  @Get("project/:projectId")
  @Roles(UserRole.Admin, UserRole.Client)
  findByProject(@Param("projectId") projectId: string) {
    return this.matchService.findByProject(+projectId);
  }

  @Get("vendor/:vendorId")
  @Roles(UserRole.Admin)
  findByVendor(@Param("vendorId") vendorId: string) {
    return this.matchService.findByVendor(+vendorId);
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  findOne(@Param("id") id: string) {
    return this.matchService.findOne(+id);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  remove(@Param("id") id: string) {
    return this.matchService.remove(+id);
  }
}
