import { SetMetadata } from "@nestjs/common";

export const PUBLIC_ROUTE_KEY = "public_route_key";

export type PublicRouteMetadata =
  | {
      isPublic: true;
    }
  | undefined;
/**
 * Stores the metadata to be later on checked in the JwtAuthGuard
 *
 * @see JwtAuthGuard
 * A controller handler marked with this decorator will not require the JWT authorization header
 * @returns {Function} - The decorator
 */
export const PublicRoute = (): Function =>
  SetMetadata<string, PublicRouteMetadata>(PUBLIC_ROUTE_KEY, {
    isPublic: true,
  });
