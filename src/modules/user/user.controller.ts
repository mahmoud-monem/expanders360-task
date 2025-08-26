import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { ApiAuth } from "src/common/decorators/api-auth.decorator";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { UserRole } from "./constants/user-role.enum";
import { UserResponseDto } from "./dtos/user.response";
import { UserService } from "./user.service";

@ApiTags("User")
@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(":id")
  @Roles(UserRole.Admin)
  @ApiAuth()
  @ApiOperation({ summary: "Get user details (Admin only)" })
  @ApiOkResponse({ type: UserResponseDto })
  @Serialize(UserResponseDto)
  async getUserDetails(@Param("id") id: string) {
    return this.userService.getUserDetails(id);
  }
}
