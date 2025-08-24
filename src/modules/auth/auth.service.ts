import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectRepository } from "@nestjs/typeorm";
import * as bcrypt from "bcryptjs";
import { Equal, Repository } from "typeorm";

import { UserStatus } from "../user/constants/user-status.enum";
import { User } from "../user/entities/user.entity";
import { LoginDto } from "./dtos/login.dto";
import { RegisterDto } from "./dtos/register.dto";

export interface AuthUserResponse {
  user: User;
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthUserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerDto.email },
    });

    if (existingUser) {
      throw new ConflictException("User with this email already exists");
    }

    const user = this.userRepository.create({
      ...registerDto,
      password: await bcrypt.hash(registerDto.password, 10),
    });

    await this.userRepository.save(user);

    return this.getAuthUserResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthUserResponse> {
    const user = await this.userRepository.findOne({
      where: { email: Equal(loginDto.email) },
    });

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException("Invalid credentials");
    }

    if (user.status === UserStatus.Inactive) {
      throw new UnauthorizedException("User is inactive");
    }

    return this.getAuthUserResponse(user);
  }

  private async getAuthUserResponse(user: User): Promise<AuthUserResponse> {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const token = this.jwtService.sign(payload);

    return {
      user,
      token,
    };
  }
}
