import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { provideCustomRepository } from "src/common/providers/custom-repository.provider";

import { CountryController } from "./country.controller";
import { CountryService } from "./country.service";
import { Country } from "./entities/country.entity";
import { CountryRepository } from "./repositories/country.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Country])],
  providers: [CountryService, provideCustomRepository(Country, CountryRepository)],
  controllers: [CountryController],
})
export class CountryModule {}
