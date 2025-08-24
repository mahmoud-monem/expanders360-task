import { Body, Controller, Post } from "@nestjs/common";
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from "@nestjs/swagger";

import { PublicRoute } from "src/common/decorators/public-route.decorator";
import { Serialize } from "src/common/interceptors/serialize.interceptor";

import { AuthService } from "./auth.service";
import { AuthenticatedUserResponseDto } from "./dtos/authenticated-user.response.dto";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: "Register a user" })
  @ApiCreatedResponse({
    description: "The user has been successfully registered",
    type: AuthenticatedUserResponseDto,
  })
  @Post("register")
  @PublicRoute()
  @Serialize(AuthenticatedUserResponseDto)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: "Login a user" })
  @ApiOkResponse({
    description: "The user has been successfully logged in",
    type: AuthenticatedUserResponseDto,
  })
  @Post("login")
  @PublicRoute()
  @Serialize(AuthenticatedUserResponseDto)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
