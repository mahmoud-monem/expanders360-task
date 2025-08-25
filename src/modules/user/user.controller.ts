import { Controller, Get, Param } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { UserResponseDto } from "./dtos/user.response";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller("users")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  @ApiAuth()
  @ApiOperation({ summary: "Get user details" })
  @ApiOkResponse({ type: UserResponseDto })
  @Serialize(UserResponseDto)
  async getUserDetails(@Param("id") id: string) {
    return this.userService.getUserDetails(id);
  }
}
