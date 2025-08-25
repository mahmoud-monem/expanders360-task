import { Type } from "class-transformer";

import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";
import { CountryResponseDto } from "src/modules/country/dtos/country.response.dto";
import { ServiceType } from "src/modules/project/constants/service-type.enum";

export class VendorResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The ID of the vendor",
      example: 1,
    },
  })
  id: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The name of the vendor",
      example: "Vendor 1",
    },
  })
  name: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The services offered by the vendor",
      example: [ServiceType.MarketResearch, ServiceType.LegalServices],
    },
  })
  offeredServices: ServiceType[];

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The rating of the vendor",
      example: 4.5,
    },
  })
  rating: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The response SLA hours of the vendor",
      example: 24,
    },
  })
  responseSlaHours: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: CountryResponseDto,
      isArray: true,
      description: "The supported countries of the vendor",
    },
  })
  @Type(() => CountryResponseDto)
  supportedCountries: CountryResponseDto[];
}
