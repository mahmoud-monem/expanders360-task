import { Type } from "class-transformer";

import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";
import { UserResponseDto } from "src/modules/user/dtos/user.response";

export class AuthenticatedUserResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: String,
      description: "The user's JWT token",
    },
  })
  token: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: UserResponseDto,
      description: "The user's information",
    },
  })
  @Type(() => UserResponseDto)
  user: UserResponseDto;
}
