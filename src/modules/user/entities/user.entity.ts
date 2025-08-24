import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

import { UserRole } from "../constants/user-role.enum";
import { UserStatus } from "../constants/user-status.enum";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column("varchar")
  name: string;

  @Column("varchar", { unique: true })
  email: string;

  @Column("varchar")
  password: string;

  @Column("enum", { enum: UserRole, default: UserRole.Client })
  role: UserRole;

  @Column("enum", { enum: UserStatus, default: UserStatus.Active })
  status: UserStatus;
}
