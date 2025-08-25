import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "nestjs-typeorm-paginate";
import { Repository } from "typeorm";

import { Country } from "../country/entities/country.entity";
import { CreateProjectDto } from "./dtos/create-project.dto";
import { GetProjectsPaginatedListQueryDto } from "./dtos/get-projects-paginated-list.query.dto";
import { UpdateProjectDto } from "./dtos/update-project.dto";
import { Project } from "./entities/project.entity";
import { ProjectRepository } from "./repositories/project.repository";

@Injectable()
export class ProjectService {
  constructor(
    private readonly projectRepository: ProjectRepository,
    @InjectRepository(Country) private readonly countryRepository: Repository<Country>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const country = await this.countryRepository.findOne({
      where: { id: createProjectDto.countryId },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${createProjectDto.countryId} not found`);
    }

    const project = this.projectRepository.create({ ...createProjectDto, country });

    return this.projectRepository.save(project);
  }

  async getProjectsPaginatedList(query: GetProjectsPaginatedListQueryDto): Promise<Pagination<Project>> {
    return this.projectRepository.getProjectsPaginatedList(query);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ["client", "matches"],
    });
  }

  async getProjectDetails(id: number): Promise<Project> {
    return this.validateProjectExistence(id);
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ["client", "matches"],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.validateProjectExistence(id);

    if (updateProjectDto.countryId) {
      const country = await this.countryRepository.findOne({
        where: { id: updateProjectDto.countryId },
      });

      if (!country) {
        throw new NotFoundException(`Country with ID ${updateProjectDto.countryId} not found`);
      }
    }

    Object.assign(project, updateProjectDto);

    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<{ message: string }> {
    await this.validateProjectExistence(id);

    await this.projectRepository.delete(id);

    return { message: "Project deleted successfully" };
  }

  private async validateProjectExistence(id: number): Promise<Project> {
    const project = await this.projectRepository.getProjectDetails(id);

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }
}
