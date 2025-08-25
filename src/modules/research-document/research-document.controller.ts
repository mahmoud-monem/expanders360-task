import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { ApiConsumes, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { MessageResponseDto } from "src/common/dtos/message.response.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { CreateResearchDocumentDto } from "./dtos/create-research-document.dto";
import { GetResearchDocumentsPaginatedListQueryDto } from "./dtos/get-research-documents-paginated-list.query.dto";
import { GetResearchDocumentsPaginatedListResponseDto } from "./dtos/get-research-documents-paginated-list.response.dto";
import { ResearchDocumentResponseDto } from "./dtos/research-document.response.dto";
import { UpdateResearchDocumentDto } from "./dtos/update-research-document.dto";
import { ResearchDocumentService } from "./research-document.service";

@ApiTags("Research Document")
@Controller("research-documents")
export class ResearchDocumentController {
  constructor(private readonly researchDocumentService: ResearchDocumentService) {}

  @Post()
  @ApiAuth()
  @ApiOperation({ summary: "Create a new research document with optional file upload" })
  @ApiOkResponse({ type: ResearchDocumentResponseDto })
  @Serialize(ResearchDocumentResponseDto)
  @UseInterceptors(FileInterceptor("file"))
  create(@Body() createResearchDocumentDto: CreateResearchDocumentDto, @UploadedFile() file?: Express.Multer.File) {
    return this.researchDocumentService.create(createResearchDocumentDto, file);
  }

  @Get()
  @ApiAuth()
  @ApiOperation({ summary: "Get research documents paginated list" })
  @ApiOkResponse({ type: GetResearchDocumentsPaginatedListResponseDto })
  @Serialize(GetResearchDocumentsPaginatedListResponseDto)
  getResearchDocumentsPaginatedList(@Query() query: GetResearchDocumentsPaginatedListQueryDto) {
    return this.researchDocumentService.getResearchDocumentsPaginatedList(query);
  }

  @Get(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Get research document details" })
  @ApiOkResponse({ type: ResearchDocumentResponseDto })
  @Serialize(ResearchDocumentResponseDto)
  getResearchDocumentDetails(@Param("id") id: string) {
    return this.researchDocumentService.getResearchDocumentDetails(id);
  }

  @Put(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Update research document with optional file upload" })
  @ApiConsumes("multipart/form-data")
  @ApiOkResponse({ type: ResearchDocumentResponseDto })
  @Serialize(ResearchDocumentResponseDto)
  @UseInterceptors(FileInterceptor("file"))
  update(
    @Param("id") id: string,
    @Body() updateResearchDocumentDto: UpdateResearchDocumentDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.researchDocumentService.update(id, updateResearchDocumentDto, file);
  }

  @Delete(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Delete research document" })
  @ApiOkResponse({ type: MessageResponseDto })
  @Serialize(MessageResponseDto)
  remove(@Param("id") id: string) {
    return this.researchDocumentService.remove(id);
  }
}
