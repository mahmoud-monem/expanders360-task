import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { initOrmConfig } from "orm/orm.config";

import { appConfig } from "./common/config/app.config";
import { AnalyticsModule } from "./modules/analytics/analytics.module";
import { AuthModule } from "./modules/auth/auth.module";
import { CountryModule } from "./modules/country/country.module";
import { HealthModule } from "./modules/health/health.module";
import { MatchModule } from "./modules/match/match.module";
import { ProjectModule } from "./modules/project/project.module";
import { ResearchDocumentModule } from "./modules/research-document/research-document.module";
import { SchedulerModule } from "./modules/scheduler/scheduler.module";
import { UserModule } from "./modules/user/user.module";
import { VendorModule } from "./modules/vendor/vendor.module";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: initOrmConfig,
    }),
    MongooseModule.forRootAsync({
      useFactory: () => ({
        uri: appConfig.MONGO_URI,
      }),
    }),
    AuthModule,
    UserModule,
    CountryModule,
    VendorModule,
    ProjectModule,
    ResearchDocumentModule,
    MatchModule,
    AnalyticsModule,
    SchedulerModule,
    HealthModule,
  ],
})
export class AppModule {}
