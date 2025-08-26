import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { MessageResponseDto } from "src/common/dtos/message.response.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { User } from "../user/entities/user.entity";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { GetProjectsPaginatedListQueryDto } from "./dtos/get-projects-paginated-list.query.dto";
import { GetProjectsPaginatedListResponseDto } from "./dtos/get-projects-paginated-list.response.dto";
import { ProjectMatchesResponseDto } from "./dtos/project-matches.response.dto";
import { ProjectResponseDto } from "./dtos/project.response.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { ProjectService } from "./project.service";

@ApiTags("Project")
@Controller("projects")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @Roles(UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Create a new project (Client only)" })
  @ApiOkResponse({ type: ProjectResponseDto })
  @Serialize(ProjectResponseDto)
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: User) {
    createProjectDto.clientId = user.id;
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Get projects paginated list (Admin: all projects, Client: own projects)" })
  @ApiOkResponse({ type: GetProjectsPaginatedListResponseDto })
  @Serialize(GetProjectsPaginatedListResponseDto)
  getProjectsPaginatedList(@Query() query: GetProjectsPaginatedListQueryDto, @CurrentUser() user: User) {
    return this.projectService.getProjectsPaginatedList(query, user);
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Get project details (Admin: any project, Client: own project only)" })
  @ApiOkResponse({ type: ProjectResponseDto })
  @Serialize(ProjectResponseDto)
  getProjectDetails(@Param("id") id: string, @CurrentUser() user: User) {
    return this.projectService.getProjectDetails(+id, user);
  }

  @Put(":id")
  @Roles(UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Update project (Client: own project only)" })
  @ApiOkResponse({ type: ProjectResponseDto })
  @Serialize(ProjectResponseDto)
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto, @CurrentUser() user: User) {
    return this.projectService.update(+id, updateProjectDto, user);
  }

  @Delete(":id")
  @Roles(UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Delete project (Client: own project only)" })
  @ApiOkResponse({ type: MessageResponseDto })
  @Serialize(MessageResponseDto)
  remove(@Param("id") id: string, @CurrentUser() user: User) {
    return this.projectService.remove(+id, user);
  }

  @Post(":id/matches/rebuild")
  @Roles(UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Rebuild vendor matches for project (Client: own project only)" })
  @ApiOkResponse({ type: ProjectMatchesResponseDto })
  @Serialize(ProjectMatchesResponseDto)
  rebuildMatches(@Param("id") id: string, @CurrentUser() user: User) {
    return this.projectService.rebuildMatches(+id, user);
  }
}
