import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { provideCustomRepository } from "src/common/providers/custom-repository.provider";

import { Country } from "../country/entities/country.entity";
import { Vendor } from "./entities/vendor.entity";
import { VendorRepository } from "./repositories/vendor.repository";
import { VendorController } from "./vendor.controller";
import { VendorService } from "./vendor.service";

@Module({
  imports: [TypeOrmModule.forFeature([Vendor, Country])],
  controllers: [VendorController],
  providers: [VendorService, provideCustomRepository(Vendor, VendorRepository)],
})
export class VendorModule {}
