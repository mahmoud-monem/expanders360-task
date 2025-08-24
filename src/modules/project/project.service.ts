import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

import { ProjectStatus } from "./constants/project-status.enum";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";
import { Project } from "./entities/project.entity";

@Injectable()
export class ProjectService {
  constructor(@InjectRepository(Project) private readonly projectRepository: Repository<Project>) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ["client", "matches"],
    });
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

  async findByClient(clientId: number): Promise<Project[]> {
    return this.projectRepository.find({
      where: { clientId },
      relations: ["client", "matches"],
    });
  }

  async findActiveProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { status: ProjectStatus.Active },
      relations: ["client", "matches"],
    });
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, updateProjectDto);
    return this.projectRepository.save(project);
  }

  async remove(id: number): Promise<void> {
    const project = await this.findOne(id);
    await this.projectRepository.remove(project);
  }
}
