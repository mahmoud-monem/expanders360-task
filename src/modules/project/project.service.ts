import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "nestjs-typeorm-paginate";
import { Equal, Repository } from "typeorm";

import { Country } from "../country/entities/country.entity";
import { Match } from "../match/entities/match.entity";
import { MatchService } from "../match/match.service";
import { NotificationService } from "../notification/notification.service";
import { ProjectStatus } from "../project/constants/project-status.enum";
import { ServiceType } from "../project/constants/service-type.enum";
import { UserRole } from "../user/constants/user-role.enum";
import { User } from "../user/entities/user.entity";
import { Vendor } from "../vendor/entities/vendor.entity";
import { VendorService } from "../vendor/vendor.service";
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
    private readonly matchService: MatchService,
    private readonly vendorService: VendorService,
    private readonly notificationService: NotificationService,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const country = await this.countryRepository.findOne({
      where: { id: Equal(createProjectDto.countryId) },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${createProjectDto.countryId} not found`);
    }

    const project = this.projectRepository.create({ ...createProjectDto, country });

    return this.projectRepository.save(project);
  }

  async getProjectsPaginatedList(query: GetProjectsPaginatedListQueryDto, user?: User): Promise<Pagination<Project>> {
    if (user && user.role === UserRole.Client) {
      if (!query.filters) {
        query.filters = {};
      }
      query.filters.clientId = user.id;
    }
    return this.projectRepository.getProjectsPaginatedList(query);
  }

  async findAll(): Promise<Project[]> {
    return this.projectRepository.find({
      relations: ["client", "matches"],
    });
  }

  async findActiveProjects(): Promise<Project[]> {
    return this.projectRepository.find({
      where: { status: ProjectStatus.Active },
      relations: ["client", "country"],
    });
  }

  async getProjectDetails(id: number, user?: User): Promise<Project> {
    const project = await this.validateProjectExistence(id);

    if (user && user.role === UserRole.Client && project.clientId !== user.id) {
      throw new ForbiddenException("You can only access your own projects");
    }

    return project;
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

  async update(id: number, updateProjectDto: UpdateProjectDto, user?: User): Promise<Project> {
    const project = await this.validateProjectExistence(id);

    if (user && user.role === UserRole.Client && project.clientId !== user.id) {
      throw new ForbiddenException("You can only update your own projects");
    }

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

  async remove(id: number, user?: User): Promise<{ message: string }> {
    const project = await this.validateProjectExistence(id);

    if (user && user.role === UserRole.Client && project.clientId !== user.id) {
      throw new ForbiddenException("You can only delete your own projects");
    }

    await this.projectRepository.delete(id);

    return { message: "Project deleted successfully" };
  }

  async rebuildMatches(projectId: number, user?: User): Promise<{ message: string; matches: Match[]; totalMatches: number }> {
    const project = await this.validateProjectExistence(projectId);

    if (user && user.role === UserRole.Client && project.clientId !== user.id) {
      throw new ForbiddenException("You can only rebuild matches for your own projects");
    }

    const matchingVendors = await this.vendorService.findVendorsForMatching(project.countryId, project.neededServices);

    await this.matchService.removeByProject(projectId);

    const matches: Match[] = [];

    for (const vendor of matchingVendors) {
      const score = this.calculateMatchScore(project, vendor);
      const match = await this.matchService.upsert({
        projectId,
        vendorId: vendor.id,
        score,
      });

      const matchWithRelations = await this.matchService.findOne(match.id);

      await this.notificationService.sendNewMatchNotification(matchWithRelations);

      matches.push(match);
    }

    matches.sort((a, b) => b.score - a.score);

    return {
      message: `Successfully rebuilt ${matches.length} matches for project ${projectId}`,
      matches,
      totalMatches: matches.length,
    };
  }

  private calculateMatchScore(project: Project, vendor: Vendor): number {
    const serviceOverlap = project.neededServices.filter(service =>
      vendor.offeredServices.includes(service as ServiceType),
    ).length;

    const slaWeight = Math.max(0, 3 - vendor.responseSlaHours / 24);

    const score = serviceOverlap * 2 + vendor.rating + slaWeight;

    return Math.round(score * 100) / 100;
  }

  private async validateProjectExistence(id: number): Promise<Project> {
    const project = await this.projectRepository.getProjectDetails(id);

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }
}
