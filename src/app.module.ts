import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { initOrmConfig } from "orm/orm.config";

import { appConfig } from "./common/config/app.config";
import { AuthModule } from "./modules/auth/auth.module";
import { CountryModule } from "./modules/country/country.module";
import { ProjectModule } from "./modules/project/project.module";
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
  ],
})
export class AppModule {}
