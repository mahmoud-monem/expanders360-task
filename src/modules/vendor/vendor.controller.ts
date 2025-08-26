import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { MessageResponseDto } from "src/common/dtos/message.response.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "../user/constants/user-role.enum";
import { CreateVendorDto } from "./dtos/create-vendor.dto";
import { GetVendorsPaginatedListQueryDto } from "./dtos/get-vendors-paginated-list.query.dto";
import { GetVendorsPaginatedListResponseDto } from "./dtos/get-vendors-paginated-list.response.dto";
import { UpdateVendorDto } from "./dtos/update-vendor.dto";
import { VendorResponseDto } from "./dtos/vendor.response.dto";
import { VendorService } from "./vendor.service";

@ApiTags("Vendor")
@Controller("vendors")
@UseGuards(JwtAuthGuard, RolesGuard)
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @Roles(UserRole.Admin)
  @ApiAuth()
  @ApiOperation({ summary: "Create a new vendor (Admin only)" })
  @ApiOkResponse({ type: VendorResponseDto })
  @Serialize(VendorResponseDto)
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Get vendors paginated list (Admin: CRUD, Client: READ only)" })
  @ApiOkResponse({ type: GetVendorsPaginatedListResponseDto })
  @Serialize(GetVendorsPaginatedListResponseDto)
  getVendorsPaginatedList(@Query() query: GetVendorsPaginatedListQueryDto) {
    return this.vendorService.getVendorsPaginatedList(query);
  }

  @Get(":id")
  @Roles(UserRole.Admin, UserRole.Client)
  @ApiAuth()
  @ApiOperation({ summary: "Get vendor details (Admin: CRUD, Client: READ only)" })
  @ApiOkResponse({ type: VendorResponseDto })
  @Serialize(VendorResponseDto)
  getVendorDetails(@Param("id") id: string) {
    return this.vendorService.getVendorDetails(+id);
  }

  @Put(":id")
  @Roles(UserRole.Admin)
  @ApiAuth()
  @ApiOperation({ summary: "Update vendor (Admin only)" })
  @ApiOkResponse({ type: VendorResponseDto })
  @Serialize(VendorResponseDto)
  update(@Param("id") id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(+id, updateVendorDto);
  }

  @Delete(":id")
  @Roles(UserRole.Admin)
  @ApiAuth()
  @ApiOperation({ summary: "Delete vendor (Admin only)" })
  @ApiOkResponse({ type: MessageResponseDto })
  @Serialize(MessageResponseDto)
  remove(@Param("id") id: string) {
    return this.vendorService.remove(+id);
  }
}
