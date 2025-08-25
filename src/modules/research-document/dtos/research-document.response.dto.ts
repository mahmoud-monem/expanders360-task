import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";
import { ExposeObjectId } from "src/common/decorators/expost-object-id.decorator";

export class ResearchDocumentResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The ID of the research document",
      example: "507f1f77bcf86cd799439011",
    },
  })
  @ExposeObjectId()
  _id: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The title of the research document",
      example: "Market Research Report - Germany",
    },
  })
  title: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The content of the research document",
      example: "This document contains comprehensive market research data...",
    },
  })
  content: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "Tags associated with the document",
      example: ["market-research", "germany", "expansion"],
      isArray: true,
    },
  })
  tags: string[];

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The project ID this document belongs to",
      example: 1,
    },
  })
  projectId: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "URL to the uploaded file",
      example: "http://localhost:9000/research-documents/project-1/1756144000000-report.pdf",
    },
  })
  fileUrl?: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "Original name of the uploaded file",
      example: "market-research-report.pdf",
    },
  })
  fileName?: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "Size of the uploaded file in bytes",
      example: 1024000,
    },
  })
  fileSize?: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "MIME type of the uploaded file",
      example: "application/pdf",
    },
  })
  mimeType?: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "Creation date of the document",
      example: "2024-01-01T00:00:00.000Z",
    },
  })
  createdAt: Date;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "Last update date of the document",
      example: "2024-01-01T00:00:00.000Z",
    },
  })
  updatedAt: Date;
}
