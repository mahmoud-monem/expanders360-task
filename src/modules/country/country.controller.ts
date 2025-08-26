import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common";
import { ApiBadRequestResponse, ApiCreatedResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { Pagination } from "nestjs-typeorm-paginate";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { CountryService } from "./country.service";
import { CountryResponseDto } from "./dtos/country.response.dto";
import { CreateCountryDto } from "./dtos/create-country.dto";
import { GetCountriesPaginatedListQueryDto } from "./dtos/get-countries-list.query.dto";
import { GetCountriesPaginatedListResponseDto } from "./dtos/get-countries-paginated-list.response.dto";
import { Country } from "./entities/country.entity";

@ApiTags("Country")
@Controller("countries")
@UseGuards(JwtAuthGuard, RolesGuard)
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiAuth()
  @ApiOperation({ summary: "Create a country (Admin only)" })
  @ApiCreatedResponse({ type: CountryResponseDto })
  @ApiBadRequestResponse()
  @Serialize(CountryResponseDto)
  async create(@Body() body: CreateCountryDto): Promise<Country> {
    return this.countryService.create(body);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Get all countries (Both roles can access)" })
  @ApiCreatedResponse({ type: CountryResponseDto, isArray: true })
  @ApiBadRequestResponse()
  @Serialize(GetCountriesPaginatedListResponseDto)
  async getCountriesList(@Query() query: GetCountriesPaginatedListQueryDto): Promise<Pagination<Country>> {
    return this.countryService.getCountriesList(query);
  }
}
