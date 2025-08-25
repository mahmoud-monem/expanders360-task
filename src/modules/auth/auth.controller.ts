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

  @Post("register")
  @ApiOperation({ summary: "Register a user" })
  @ApiCreatedResponse({ type: AuthenticatedUserResponseDto })
  @PublicRoute()
  @Serialize(AuthenticatedUserResponseDto)
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post("login")
  @ApiOperation({ summary: "Login a user" })
  @ApiOkResponse({ type: AuthenticatedUserResponseDto })
  @PublicRoute()
  @Serialize(AuthenticatedUserResponseDto)
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}
