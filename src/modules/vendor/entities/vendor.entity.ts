import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

import { Country } from "../../country/entities/country.entity";
import { Match } from "../../match/entities/match.entity";
import { ServiceType } from "../../project/constants/service-type.enum";

@Entity()
export class Vendor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column("enum", { array: true, enum: ServiceType, enumName: "service_type_enum" })
  offeredServices: ServiceType[];

  @Column("decimal", { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column("int")
  responseSlaHours: number;

  // Relations

  @OneToMany(() => Match, match => match.vendor)
  matches: Match[];

  @ManyToMany(() => Country)
  @JoinTable({
    name: "vendor_supported_countries",
    joinColumn: {
      name: "vendor_id",
      referencedColumnName: "id",
      foreignKeyConstraintName: "vendor_supported_countries_vendor_id_fkey",
    },
    inverseJoinColumn: {
      name: "country_id",
      referencedColumnName: "id",
      foreignKeyConstraintName: "vendor_supported_countries_country_id_fkey",
    },
  })
  supportedCountries: Country[];
}
