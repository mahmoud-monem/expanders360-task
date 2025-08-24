import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { appConfig } from "../config/app.config";
import { Environment } from "../constants/environment.enum";

const DISABLED_ENVS = [Environment.Production];

export const SHARED_SWAGGER_CSS = "https://s3.us-east-1.wasabisys.com/qariahaudio/assets/swagger.css";

/**
 * Setup swagger documentation for the application
 *
 * @param {INestApplication} app - Nest application instance
 * @param {string} title - Title of project documentation
 * @param {string} description - Description of project documentation
 * @param {string} version - Version of project documentation
 * @param {string[]} customCssUrls - paths to custom CSS files for the documentation
 */
export function setupApiDocumentation(
  app: INestApplication,
  title: string,
  description: string,
  version: string,
  customCssUrls: string[] = [],
): void {
  const swaggerOptions = new DocumentBuilder()
    .setTitle(title)
    .setDescription(description)
    .setVersion(version)
    .addBearerAuth({
      type: "http",
      name: "authorization",
      in: "header",
      scheme: "bearer",
      bearerFormat: "JWT",
    })
    .setExternalDoc("JSON document", "/api/docs-json")
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);

  SwaggerModule.setup("api/docs", app, swaggerDocument, {
    customCssUrl: [SHARED_SWAGGER_CSS, ...customCssUrls],
    swaggerOptions: {
      persistAuthorization: true,
      useUnsafeMarkdown: true,
    },
  });
}

/**
 * Setup swagger documentation for application
 */
export function setupSwagger(
  app: INestApplication,
  projectName: string,
  description: string = `Interactions with the ${projectName} API`,
  version: string = process.env.npm_package_version || "1.0",
): boolean {
  if (DISABLED_ENVS.includes(appConfig.NODE_ENV)) {
    return false;
  }

  setupApiDocumentation(app, `${projectName} API Docs`, description, version);

  return true;
}
