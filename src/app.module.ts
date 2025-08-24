import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { TypeOrmModule } from "@nestjs/typeorm";
import { initOrmConfig } from "orm/orm.config";

import { appConfig } from "./common/config/app.config";
import { AuthModule } from "./modules/auth/auth.module";

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
  ],
})
export class AppModule {}
