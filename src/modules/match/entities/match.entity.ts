import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import { Project } from "../../project/entities/project.entity";
import { Vendor } from "../../vendor/entities/vendor.entity";

@Entity()
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("int")
  projectId: number;

  @Column("int")
  vendorId: number;

  @Column("decimal", { precision: 5, scale: 2 })
  score: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Project, project => project.matches, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "project_id" })
  project: Project;

  @ManyToOne(() => Vendor, vendor => vendor.matches, { onDelete: "CASCADE", onUpdate: "CASCADE" })
  @JoinColumn({ name: "vendor_id" })
  vendor: Vendor;
}
