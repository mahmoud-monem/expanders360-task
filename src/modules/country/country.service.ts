import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { Equal } from "typeorm";

import { CreateCountryDto } from "./dtos/create-country.dto";
import { GetCountriesPaginatedListQueryDto } from "./dtos/get-countries-list.query.dto";
import { CountryRepository } from "./repositories/country.repository";

@Injectable()
export class CountryService {
  constructor(private readonly countryRepository: CountryRepository) {}

  async create(createCountryDto: CreateCountryDto) {
    await Promise.all([this.validateCountryCode(createCountryDto.code), this.validateCountryIsoCode(createCountryDto.isoCode)]);

    const country = this.countryRepository.create(createCountryDto);

    return this.countryRepository.save(country);
  }

  async getCountriesList(query: GetCountriesPaginatedListQueryDto) {
    return this.countryRepository.getCountriesPaginatedList(query);
  }

  async getById(id: number) {
    const country = await this.countryRepository.findOne({
      where: { id },
      relations: ["translations"],
    });

    if (!country) {
      throw new NotFoundException("Country not found");
    }

    return country;
  }

  private async validateCountryCode(code: string) {
    const country = await this.countryRepository.findOne({
      where: {
        code: Equal(code),
      },
    });

    if (country) {
      throw new BadRequestException("Country code already exists");
    }

    return country;
  }

  private async validateCountryIsoCode(isoCode: string) {
    const country = await this.countryRepository.findOne({
      where: {
        isoCode: Equal(isoCode),
      },
    });

    if (country) {
      throw new BadRequestException("Country iso code already exists");
    }

    return country;
  }
}
