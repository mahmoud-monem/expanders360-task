import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { Strategy } from "passport-http-bearer";
import { Repository } from "typeorm";

import { User } from "../../user/entities/user.entity";
import { AuthStrategy } from "../constants/auth-strategy.enum";

export interface JwtPayload {
  sub: number;
  email: string;
  role: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, AuthStrategy.JWT) {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {
    super({
      passReqToCallback: true,
    });
  }

  public async validate(_req: Request, token: string): Promise<User> {
    // const isTokenValid = await this.jwtService.verifyAsync(token);

    // if (!isTokenValid) {
    //   throw new UnauthorizedException();
    // }

    const payload = this.jwtService.decode<JwtPayload>(token);

    if (!payload) {
      throw new UnauthorizedException();
    }

    return this.authorize(payload);
  }

  private async authorize(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException("User not found");
    }

    return user;
  }
}
