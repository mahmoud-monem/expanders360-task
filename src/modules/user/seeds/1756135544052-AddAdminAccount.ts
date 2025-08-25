import * as bcrypt from "bcryptjs";
import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminAccount1756135544052 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO users (name, email, password, role, status, created_at, updated_at)
      VALUES ('Admin', 'admin@example.com', '${await bcrypt.hash("password", 10)}', 'admin', 'active', NOW(), NOW());
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM users WHERE email = 'admin@example.com';
    `);
  }
}
