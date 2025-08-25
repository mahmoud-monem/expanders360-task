import { ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { request } from "express";

import { PUBLIC_ROUTE_KEY, PublicRouteMetadata } from "src/common/decorators/public-route.decorator";
import { User } from "src/modules/user/entities/user.entity";

import { AuthStrategy } from "../constants/auth-strategy.enum";
import { ROLES_KEY } from "../decorators/roles.decorator";

@Injectable()
export class JwtAuthGuard extends AuthGuard(AuthStrategy.JWT) {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  /**
   * Attaches `user` and `ability` to the request based on the `authorization` header,
   * additionally checks the ability if the `@CheckAbility` decorator was set.
   * Skips the token check in case the `@PublicRoute` decorator was set for the handler.
   *
   * @param {ExecutionContext} context - the context of the current request
   * @returns {Promise<boolean>} - whether the current request is allowed to proceed or not.
   */
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const handler = context.getHandler();

    if (this.isPublicRoute(handler)) return true;

    await super.canActivate(context);

    const isAllowed = this.checkRole(handler);

    if (!isAllowed) {
      throw new ForbiddenException("You are not authorized to access this resource");
    }

    return true;
  }

  private checkRole(handler: Function): boolean {
    const metadata = this.reflector.get(ROLES_KEY, handler);

    if (!metadata) {
      return true;
    }

    const requiredRoles = metadata.roles;

    return requiredRoles.some((role: string) => (request.user as User).role === role);
  }

  /**
   * Checks if the current handler was decorated with @PublicRoute
   *
   * @see PublicRoute
   *
   * @param {Function} handler - current controller handler
   * @returns {boolean} true when current controller handler was marked as publicly available
   */
  private isPublicRoute(handler: Function): boolean {
    const metadata = this.reflector.get<PublicRouteMetadata>(PUBLIC_ROUTE_KEY, handler);

    return !!metadata?.isPublic;
  }
}
