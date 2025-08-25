import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { CountryService } from "./country.service";
import { CountryResponseDto } from "./dtos/country.response.dto";
import { CreateCountryDto } from "./dtos/create-country.dto";
import { GetCountriesPaginatedListQueryDto } from "./dtos/get-countries-list.query.dto";
import { GetCountriesPaginatedListResponseDto } from "./dtos/get-countries-paginated-list.response.dto";
import { Country } from "./entities/country.entity";

@ApiTags("Country")
@Controller("countries")
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @ApiAuth()
  @ApiOperation({ summary: "Create a country" })
  @ApiCreatedResponse({ type: CountryResponseDto })
  @ApiBadRequestResponse()
  @Serialize(CountryResponseDto)
  async create(@Body() body: CreateCountryDto): Promise<Country> {
    return this.countryService.create(body);
  }

  @Get()
  @ApiAuth()
  @ApiOperation({ summary: "Get all countries" })
  @ApiCreatedResponse({ type: CountryResponseDto, isArray: true })
  @ApiBadRequestResponse()
  @Serialize(GetCountriesPaginatedListResponseDto)
  async getCountriesList(@Query() query: GetCountriesPaginatedListQueryDto): Promise<Pagination<Country>> {
    return this.countryService.getCountriesList(query);
  }
}
