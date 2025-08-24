import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateUserTable1756079069091 implements MigrationInterface {
  name = "CreateUserTable1756079069091";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'client')`);
    await queryRunner.query(`CREATE TYPE "public"."users_status_enum" AS ENUM('active', 'inactive')`);
    await queryRunner.query(`CREATE TABLE "users" (
      "id" SERIAL NOT NULL,
      "name" character varying NOT NULL,
      "email" character varying NOT NULL,
      "password" character varying NOT NULL,
      "role" "public"."users_role_enum" NOT NULL DEFAULT 'client',
      "status" "public"."users_status_enum" NOT NULL DEFAULT 'active',
      CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"),
      CONSTRAINT "users_id_pkey" PRIMARY KEY ("id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_status_enum"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
