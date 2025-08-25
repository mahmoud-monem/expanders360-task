import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateProjectTable1756148885854 implements MigrationInterface {
  name = "CreateProjectTable1756148885854";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('active', 'pending', 'completed', 'cancelled')`);
    await queryRunner.query(
      `CREATE TABLE "projects" (
        "id" SERIAL NOT NULL,
        "client_id" integer NOT NULL,
        "country_id" integer NOT NULL,
        "needed_services" "public"."service_type_enum" array NOT NULL,
        "budget" numeric(15,2) NOT NULL,
        "status" "public"."projects_status_enum" NOT NULL DEFAULT 'pending',
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "projects_id_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_ca29f959102228649e714827478" FOREIGN KEY ("client_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "projects" ADD CONSTRAINT "FK_445fce9883e0e1e94d671360fcf" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_445fce9883e0e1e94d671360fcf"`);
    await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_ca29f959102228649e714827478"`);
    await queryRunner.query(`DROP TABLE "projects"`);
    await queryRunner.query(`DROP TYPE "public"."projects_status_enum"`);
  }
}
