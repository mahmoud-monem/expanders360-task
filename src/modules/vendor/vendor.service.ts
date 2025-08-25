import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "nestjs-typeorm-paginate";
import { In, Repository } from "typeorm";

import { Country } from "../country/entities/country.entity";
import { CreateVendorDto } from "./dtos/create-vendor.dto";
import { GetVendorsPaginatedListQueryDto } from "./dtos/get-vendors-paginated-list.query.dto";
import { UpdateVendorDto } from "./dtos/update-vendor.dto";
import { Vendor } from "./entities/vendor.entity";
import { VendorRepository } from "./repositories/vendor.repository";

@Injectable()
export class VendorService {
  constructor(
    private readonly vendorRepository: VendorRepository,
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const supportedCountries = await this.countryRepository.find({
      where: { id: In(createVendorDto.supportedCountryIds) },
    });

    if (supportedCountries.length !== createVendorDto.supportedCountryIds.length) {
      throw new NotFoundException("Some countries not found");
    }

    const vendor = this.vendorRepository.create({
      ...createVendorDto,
      supportedCountries,
    });

    return this.vendorRepository.save(vendor);
  }

  async getVendorsPaginatedList(query: GetVendorsPaginatedListQueryDto): Promise<Pagination<Vendor>> {
    return this.vendorRepository.getVendorsPaginatedList(query);
  }

  async getVendorDetails(id: number): Promise<Vendor> {
    return this.validateVendorExistence(id);
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const [vendor, supportedCountries] = await Promise.all([
      this.validateVendorExistence(id),
      this.validateSupportedCountriesExistence(updateVendorDto.supportedCountryIds),
    ]);

    Object.assign(vendor, { ...updateVendorDto, supportedCountries });

    return this.vendorRepository.save(vendor);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.validateVendorExistence(id);

    await this.vendorRepository.delete(id);

    return { message: "Vendor deleted successfully" };
  }

  private async validateVendorExistence(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.getVendorDetails(id);

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  private async validateSupportedCountriesExistence(supportedCountryIds: number[]): Promise<Country[]> {
    const supportedCountries = await this.countryRepository.find({
      where: { id: In(supportedCountryIds) },
    });

    if (supportedCountries.length !== supportedCountryIds.length) {
      throw new NotFoundException("Some countries not found");
    }

    return supportedCountries;
  }
}
