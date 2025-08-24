import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Match } from "../../match/entities/match.entity";
import { ServiceType } from "../../project/constants/service-type.enum";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column("json")
  countriesSupported: string[];

  @Column("json")
  servicesOffered: ServiceType[];

  @Column("decimal", { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column("int")
  responseSlaHours: number;

  @OneToMany(() => Match, match => match.vendor)
  matches: Match[];
}
