import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar", { unique: true })
  code: string;

  @Column("varchar", { unique: true })
  isoCode: string;

  @Column("varchar")
  longitude: string;

  @Column("varchar")
  latitude: string;

  @CreateDateColumn()
  createdAt: Date;
}
