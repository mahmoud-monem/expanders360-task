import { ValidationPipe } from "@nestjs/common";
import { NestFactory, Reflector } from "@nestjs/core";

import { AppModule } from "./app.module";
import { appConfig } from "./common/config/app.config";
import { ApiValidationError } from "./common/errors/api-validation.error";
import { createLogger } from "./common/utils/create-logger";
import { setupSwagger } from "./common/utils/setup-swagger";
import { JwtAuthGuard } from "./modules/auth/guards/jwt-auth.guard";

const APP_NAME = "EXPANDERS360-TASK";

async function bootstrap() {
  const port = appConfig.APP_PORT;
  const host = appConfig.APP_HOST;

  const logger = createLogger(APP_NAME, {
    colors: true,
    prettyPrint: true,
    useOriginalNestLogFormat: true,
  });

  const app = await NestFactory.create(AppModule, {
    logger,
  });

  app.setGlobalPrefix("api");

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: errors => new ApiValidationError(errors),
    }),
  );

  const reflector = app.get(Reflector);

  app.useGlobalGuards(new JwtAuthGuard(reflector));

  const isSwaggerEnabled = setupSwagger(app, APP_NAME);

  await app.listen(port);

  logger.log("info", `Listening on port: ${port}`);

  if (isSwaggerEnabled) {
    logger.log("info", `Explore api on http://${host}:${port}/api/docs`);
  }
}

bootstrap();
