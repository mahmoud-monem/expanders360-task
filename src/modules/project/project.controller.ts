import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { MessageResponseDto } from "src/common/dtos/message.response.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { User } from "../user/entities/user.entity";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { GetProjectsPaginatedListQueryDto } from "./dtos/get-projects-paginated-list.query.dto";
import { GetProjectsPaginatedListResponseDto } from "./dtos/get-projects-paginated-list.response.dto";
import { ProjectResponseDto } from "./dtos/project.response.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { ProjectService } from "./project.service";

@ApiTags("Project")
@Controller("projects")
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  @ApiAuth()
  @ApiOperation({ summary: "Create a new project" })
  @ApiOkResponse({ type: ProjectResponseDto })
  @Serialize(ProjectResponseDto)
  create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: User) {
    createProjectDto.clientId = user.id;
    return this.projectService.create(createProjectDto);
  }

  @Get()
  @ApiAuth()
  @ApiOperation({ summary: "Get projects paginated list" })
  @ApiOkResponse({ type: GetProjectsPaginatedListResponseDto })
  @Serialize(GetProjectsPaginatedListResponseDto)
  getProjectsPaginatedList(@Query() query: GetProjectsPaginatedListQueryDto) {
    return this.projectService.getProjectsPaginatedList(query);
  }

  @Get(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Get project details" })
  @ApiOkResponse({ type: ProjectResponseDto })
  @Serialize(ProjectResponseDto)
  getProjectDetails(@Param("id") id: string) {
    return this.projectService.getProjectDetails(+id);
  }

  @Put(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Update project" })
  @ApiOkResponse({ type: ProjectResponseDto })
  @Serialize(ProjectResponseDto)
  update(@Param("id") id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectService.update(+id, updateProjectDto);
  }

  @Delete(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Delete project" })
  @ApiOkResponse({ type: MessageResponseDto })
  @Serialize(MessageResponseDto)
  remove(@Param("id") id: string) {
    return this.projectService.remove(+id);
  }
}
