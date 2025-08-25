import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";

export class CountryResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The id of the country",
      type: Number,
      example: 1,
    },
  })
  id: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The code of the country",
      type: String,
      example: "US",
    },
  })
  code: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The ISO code of the country",
      type: String,
      example: "US",
    },
  })
  isoCode: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The longitude of the country",
      type: String,
      example: "-122.4194",
    },
  })
  longitude: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The latitude of the country",
      type: String,
      example: "37.7749",
    },
  })
  latitude: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The name of the country",
      type: String,
      example: "United States",
    },
  })
  name: string;
}
