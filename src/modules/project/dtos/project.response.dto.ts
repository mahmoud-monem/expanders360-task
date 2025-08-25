import { Type } from "class-transformer";

import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";
import { CountryResponseDto } from "src/modules/country/dtos/country.response.dto";
import { UserResponseDto } from "src/modules/user/dtos/user.response";

import { ProjectStatus } from "../constants/project-status.enum";
import { ServiceType } from "../constants/service-type.enum";

export class ProjectResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The ID of the project",
      example: 1,
    },
  })
  id: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The ID of the client",
      example: 1,
    },
  })
  clientId: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The ID of the country",
      example: 1,
    },
  })
  countryId: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The services needed for the project",
      example: [ServiceType.MarketResearch, ServiceType.LegalServices],
    },
  })
  neededServices: ServiceType[];

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The budget of the project",
      example: 10000.0,
    },
  })
  budget: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The status of the project",
      example: ProjectStatus.Active,
    },
  })
  status: ProjectStatus;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The creation date of the project",
      example: "2024-01-01T00:00:00.000Z",
    },
  })
  createdAt: Date;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The client associated with the project",
    },
  })
  @Type(() => UserResponseDto)
  client: UserResponseDto;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The country associated with the project",
    },
  })
  @Type(() => CountryResponseDto)
  country: CountryResponseDto;
}
