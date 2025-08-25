import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { MessageResponseDto } from "src/common/dtos/message.response.dto";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { CreateVendorDto } from "./dtos/create-vendor.dto";
import { GetVendorsPaginatedListQueryDto } from "./dtos/get-vendors-paginated-list.query.dto";
import { GetVendorsPaginatedListResponseDto } from "./dtos/get-vendors-paginated-list.response.dto";
import { UpdateVendorDto } from "./dtos/update-vendor.dto";
import { VendorResponseDto } from "./dtos/vendor.response.dto";
import { VendorService } from "./vendor.service";

@ApiTags("Vendor")
@Controller("vendors")
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  @ApiAuth()
  @ApiOperation({ summary: "Create a new vendor" })
  @ApiOkResponse({ type: VendorResponseDto })
  @Serialize(VendorResponseDto)
  create(@Body() createVendorDto: CreateVendorDto) {
    return this.vendorService.create(createVendorDto);
  }

  @Get()
  @ApiAuth()
  @ApiOperation({ summary: "Get vendors paginated list" })
  @ApiOkResponse({ type: GetVendorsPaginatedListResponseDto })
  @Serialize(GetVendorsPaginatedListResponseDto)
  getVendorsPaginatedList(@Query() query: GetVendorsPaginatedListQueryDto, @Req() req: any) {
    console.log(req.query);
    return this.vendorService.getVendorsPaginatedList(query);
  }

  @Get(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Get vendor details" })
  @ApiOkResponse({ type: VendorResponseDto })
  @Serialize(VendorResponseDto)
  getVendorDetails(@Param("id") id: string) {
    return this.vendorService.getVendorDetails(+id);
  }

  @Put(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Update vendor" })
  @ApiOkResponse({ type: VendorResponseDto })
  @Serialize(VendorResponseDto)
  update(@Param("id") id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(+id, updateVendorDto);
  }

  @Delete(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Delete vendor" })
  @ApiOkResponse({ type: MessageResponseDto })
  @Serialize(MessageResponseDto)
  remove(@Param("id") id: string) {
    return this.vendorService.remove(+id);
  }
}
