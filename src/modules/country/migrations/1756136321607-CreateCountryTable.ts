import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCountryTable1756136321607 implements MigrationInterface {
  name = "CreateCountryTable1756136321607";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "countries" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "code" character varying NOT NULL,
        "iso_code" character varying NOT NULL,
        "longitude" character varying NOT NULL,
        "latitude" character varying NOT NULL,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_b47cbb5311bad9c9ae17b8c1eda" UNIQUE ("code"),
        CONSTRAINT "UQ_31d60a54633e88225b40081e187" UNIQUE ("iso_code"),
        CONSTRAINT "countries_id_pkey" PRIMARY KEY ("id")
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "countries"`);
  }
}
