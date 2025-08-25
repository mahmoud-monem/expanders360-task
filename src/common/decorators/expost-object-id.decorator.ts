import { applyDecorators } from "@nestjs/common";
import { Expose, ExposeOptions, Transform } from "class-transformer";

export function ExposeObjectId(options?: ExposeOptions) {
  return applyDecorators(
    Expose(options),
    Transform(({ obj }) => obj._id?.toString()),
  );
}
