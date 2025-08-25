import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";

import { provideCustomRepository } from "src/common/providers/custom-repository.provider";

import { Country } from "../country/entities/country.entity";
import { Project } from "./entities/project.entity";
import { ProjectController } from "./project.controller";
import { ProjectService } from "./project.service";
import { ProjectRepository } from "./repositories/project.repository";

@Module({
  imports: [TypeOrmModule.forFeature([Project, Country])],
  controllers: [ProjectController],
  providers: [ProjectService, provideCustomRepository(Project, ProjectRepository)],
})
export class ProjectModule {}
