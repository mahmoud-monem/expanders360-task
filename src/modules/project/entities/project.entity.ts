import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Country } from "../../country/entities/country.entity";
import { Match } from "../../match/entities/match.entity";
import { User } from "../../user/entities/user.entity";
import { ProjectStatus } from "../constants/project-status.enum";
import { ServiceType } from "../constants/service-type.enum";

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int4")
  clientId: number;

  @Column("int4")
  countryId: number;

  @Column("enum", { enum: ServiceType, array: true, enumName: "service_type_enum" })
  neededServices: ServiceType[];

  @Column("decimal", { precision: 15, scale: 2 })
  budget: number;

  @Column("enum", { enum: ProjectStatus, default: ProjectStatus.Pending })
  status: ProjectStatus;

  @CreateDateColumn()
  createdAt: Date;

  // Relations

  @ManyToOne(() => User, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "client_id" })
  client: User;

  @ManyToOne(() => Country)
  @JoinColumn({ name: "country_id" })
  country: Country;

  @OneToMany(() => Match, match => match.project)
  matches: Match[];
}
