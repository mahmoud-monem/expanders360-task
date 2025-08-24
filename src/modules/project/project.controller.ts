import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { User } from "../user/entities/user.entity";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { ProjectService } from "./project.service";

@Controller("projects")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Client)
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: User) {
    // Additional logic needed to ensure clients can only create for themselves
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Roles(UserRole.Admin)
  findAll() {
    return this.projectService.findAll();
  }

  @Get("client/:clientId")
  @Roles(UserRole.Admin, UserRole.Client)
  findByClient(@Param("clientId") clientId: string, @CurrentUser() user: User) {
    // Additional logic needed to ensure clients can only access their own projects
    return this.projectService.findByClient(+clientId);
  }

  @Get("active")
  @Roles(UserRole.Admin)
  findActiveProjects() {
    return this.projectService.findActiveProjects();
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  findOne(@Param("id") id: string, @CurrentUser() user: User) {
    // Additional logic needed to ensure clients can only access their own projects
    return this.projectService.findOne(+id);
  }

  @Patch(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto, @CurrentUser() user: User) {
    // Additional logic needed to ensure clients can only update their own projects
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  remove(@Param("id") id: string) {
    return this.projectService.remove(+id);
  }
}
