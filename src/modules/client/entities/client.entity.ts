import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Project } from "../../project/entities/project.entity";

@Entity()
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  companyName: string;

  @Column("varchar", { unique: true })
  contactEmail: string;

  @OneToMany(() => Project, project => project.client)
  projects: Project[];
}
