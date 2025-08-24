import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { CreateVendorDto } from "./dto/create-vendor.dto";
import { UpdateVendorDto } from "./dto/update-vendor.dto";
import { VendorService } from "./vendor.service";

@Controller("vendors")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.Admin)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  findAll() {
    return this.vendorService.findAll();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.vendorService.findOne(+id);
  }

  @Patch(":id")
  update(@Param("id") id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(+id, updateVendorDto);
  }

  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.vendorService.remove(+id);
  }
}
