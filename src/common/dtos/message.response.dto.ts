import { ApiPropertyExpose } from "../decorators/api-property-expose.decorator";

export class MessageResponseDto {
  @ApiPropertyExpose({
    apiPropertyOptions: {
      description: "The message",
      example: "message",
    },
  })
  message: string;
}
