import { ApiPropertyExpose } from "src/common/decorators/api-property-expose.decorator";

import { UserRole } from "../constants/user-role.enum";

export class UserResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: Number,
      description: "The user's ID",
      example: 1,
    },
  })
  id: number;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: String,
      description: "The user's email",
      example: "test@test.com",
    },
  })
  email: string;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: String,
      description: "The user's role",
      example: UserRole.Client,
    },
  })
  role: UserRole;

  @ApiPropertyExpose({
    apiPropertyOptions: {
      type: String,
      description: "The user's first name",
      example: "John",
    },
  })
  name: string;
}
