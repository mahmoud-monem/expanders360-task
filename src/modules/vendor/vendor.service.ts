import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ServiceType } from "../project/constants/service-type.enum";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { Vendor } from "./entities/vendor.entity";

@Injectable()
export class VendorService {
  constructor(@InjectRepository(Vendor) private readonly vendorRepository: Repository<Vendor>) {}

  async create(createVendorDto: CreateVendorDto): Promise<Vendor> {
    const vendor = this.vendorRepository.create(createVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async findAll(): Promise<Vendor[]> {
    return this.vendorRepository.find({
      relations: ["matches"],
    });
  }

  async findOne(id: number): Promise<Vendor> {
    const vendor = await this.vendorRepository.findOne({
      where: { id },
      relations: ["matches"],
    });

    if (!vendor) {
      throw new NotFoundException(`Vendor with ID ${id} not found`);
    }

    return vendor;
  }

  async findByCountryAndServices(country: string, services: ServiceType[]): Promise<Vendor[]> {
    return this.vendorRepository
      .createQueryBuilder("vendor")
      .where("JSON_CONTAINS(vendor.countries_supported, :country)", { country: JSON.stringify(country) })
      .andWhere("JSON_OVERLAPS(vendor.services_offered, :services)", { services: JSON.stringify(services) })
      .getMany();
  }

  async update(id: number, updateVendorDto: UpdateVendorDto): Promise<Vendor> {
    const vendor = await this.findOne(id);
    Object.assign(vendor, updateVendorDto);
    return this.vendorRepository.save(vendor);
  }

  async remove(id: number): Promise<void> {
    const vendor = await this.findOne(id);
    await this.vendorRepository.remove(vendor);
  }
}
