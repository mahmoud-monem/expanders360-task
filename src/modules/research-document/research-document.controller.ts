import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { CreateResearchDocumentDto } from "./dto/create-research-document.dto";
import { SearchResearchDocumentDto } from "./dto/search-research-document.dto";
import { UpdateResearchDocumentDto } from "./dto/update-research-document.dto";
import { ResearchDocumentService } from "./research-document.service";

@Controller("research-documents")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResearchDocumentController {
  constructor(private readonly researchDocumentService: ResearchDocumentService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Client)
  create(@Body() createResearchDocumentDto: CreateResearchDocumentDto) {
    return this.researchDocumentService.create(createResearchDocumentDto);
  }

  @Post("search")
  @Roles(UserRole.Admin, UserRole.Client)
  search(@Body() searchDto: SearchResearchDocumentDto) {
    return this.researchDocumentService.search(searchDto);
  }

  @Get()
  @Roles(UserRole.Admin)
  findAll() {
    return this.researchDocumentService.findAll();
  }

  @Get("project/:projectId")
  @Roles(UserRole.Admin, UserRole.Client)
  findByProject(@Param("projectId") projectId: string) {
    return this.researchDocumentService.findByProject(+projectId);
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  findOne(@Param("id") id: string) {
    return this.researchDocumentService.findOne(id);
  }

  @Patch(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  update(@Param("id") id: string, @Body() updateResearchDocumentDto: UpdateResearchDocumentDto) {
    return this.researchDocumentService.update(id, updateResearchDocumentDto);
  }

  @Delete(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  remove(@Param("id") id: string) {
    return this.researchDocumentService.remove(id);
  }
}
