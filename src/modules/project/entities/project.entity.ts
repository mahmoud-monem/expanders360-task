import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Client } from "../../client/entities/client.entity";
import { Match } from "../../match/entities/match.entity";
import { ProjectStatus } from "../constants/project-status.enum";
import { ServiceType } from "../constants/service-type.enum";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  clientId: number;

  @Column("varchar")
  country: string;

  @Column("json")
  servicesNeeded: ServiceType[];

  @Column("decimal", { precision: 15, scale: 2 })
  budget: number;

  @Column("enum", { enum: ProjectStatus, default: ProjectStatus.Pending })
  status: ProjectStatus;

  @ManyToOne(() => Client, client => client.projects)
  @JoinColumn({ name: "client_id" })
  client: Client;

  @OneToMany(() => Match, match => match.project)
  matches: Match[];
}
