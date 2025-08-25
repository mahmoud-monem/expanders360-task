import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMatchTable1756163430057 implements MigrationInterface {
  name = "CreateMatchTable1756163430057";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "matches" (
        "id" SERIAL NOT NULL,
        "project_id" integer NOT NULL,
        "vendor_id" integer NOT NULL,
        "score" numeric(5,2) NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "matches_id_pkey" PRIMARY KEY ("id"),
        CONSTRAINT "FK_416d7b6f94de26244a7be38d87a" FOREIGN KEY ("project_id") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE,
        CONSTRAINT "FK_dfb298e37d26ca75c3b1b1c8010" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_dfb298e37d26ca75c3b1b1c8010"`);
    await queryRunner.query(`ALTER TABLE "matches" DROP CONSTRAINT "FK_416d7b6f94de26244a7be38d87a"`);
    await queryRunner.query(`DROP TABLE "matches"`);
  }
}
