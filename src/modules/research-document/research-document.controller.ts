import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { MessageResponseDto } from "src/common/dtos/message.response.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { User } from "../user/entities/user.entity";
import { CreateResearchDocumentDto } from "./dtos/create-research-document.dto";
import { GetResearchDocumentsPaginatedListQueryDto } from "./dtos/get-research-documents-paginated-list.query.dto";
import { GetResearchDocumentsPaginatedListResponseDto } from "./dtos/get-research-documents-paginated-list.response.dto";
import { ResearchDocumentResponseDto } from "./dtos/research-document.response.dto";
import { UpdateResearchDocumentDto } from "./dtos/update-research-document.dto";
import { ResearchDocumentService } from "./research-document.service";

@ApiTags("Research Document")
@Controller("research-documents")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ResearchDocumentController {
  constructor(private readonly researchDocumentService: ResearchDocumentService) {}

  @Post()
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Create a new research document with optional file upload (Client: own projects, Admin: all)" })
  @ApiOkResponse({ type: ResearchDocumentResponseDto })
  @Serialize(ResearchDocumentResponseDto)
  @UseInterceptors(FileInterceptor("file"))
  create(
    @Body() createResearchDocumentDto: CreateResearchDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
    @CurrentUser() user?: User,
  ) {
    return this.researchDocumentService.create(createResearchDocumentDto, file, user);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Get research documents paginated list (Client: own project docs, Admin: all docs)" })
  @ApiOkResponse({ type: GetResearchDocumentsPaginatedListResponseDto })
  @Serialize(GetResearchDocumentsPaginatedListResponseDto)
  getResearchDocumentsPaginatedList(@Query() query: GetResearchDocumentsPaginatedListQueryDto, @CurrentUser() user: User) {
    return this.researchDocumentService.getResearchDocumentsPaginatedList(query, user);
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Get research document details (Client: own project docs, Admin: all docs)" })
  @ApiOkResponse({ type: ResearchDocumentResponseDto })
  @Serialize(ResearchDocumentResponseDto)
  getResearchDocumentDetails(@Param("id") id: string, @CurrentUser() user: User) {
    return this.researchDocumentService.getResearchDocumentDetails(id, user);
  }

  @Put(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Update research document with optional file upload (Client: own project docs, Admin: all docs)" })
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({ type: ResearchDocumentResponseDto })
  @Serialize(ResearchDocumentResponseDto)
  @UseInterceptors(FileInterceptor("file"))
  update(
    @Param("id") id: string,
    @Body() updateResearchDocumentDto: UpdateResearchDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
    @CurrentUser() user?: User,
  ) {
    return this.researchDocumentService.update(id, updateResearchDocumentDto, file, user);
  }

  @Delete(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Delete research document (Client: own project docs, Admin: all docs)" })
  @ApiOkResponse({ type: MessageResponseDto })
  @Serialize(MessageResponseDto)
  remove(@Param("id") id: string, @CurrentUser() user: User) {
    return this.researchDocumentService.remove(id, user);
  }
}
