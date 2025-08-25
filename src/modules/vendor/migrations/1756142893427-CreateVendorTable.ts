import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateVendorTable1756142893427 implements MigrationInterface {
  name = "CreateVendorTable1756142893427";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."service_type_enum" AS ENUM('market_research', 'legal_services', 'tax_consulting', 'business_setup', 'local_partnerships', 'regulatory_compliance', 'translation', 'office_setup')`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendors" (
        "id" SERIAL NOT NULL,
        "name" character varying NOT NULL,
        "offered_services" "public"."service_type_enum" array NOT NULL,
        "rating" numeric(3,2) NOT NULL DEFAULT '0',
        "response_sla_hours" integer NOT NULL,
        CONSTRAINT "vendors_id_pkey" PRIMARY KEY ("id")
      )`,
    );
    await queryRunner.query(
      `CREATE TABLE "vendor_supported_countries" ("vendor_id" integer NOT NULL, "country_id" integer NOT NULL, CONSTRAINT "vendor_supported_countries_country_id_vendor_id_pkey" PRIMARY KEY ("vendor_id", "country_id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "index_vendor_supported_countries_vendor_id" ON "vendor_supported_countries" ("vendor_id") `,
    );
    await queryRunner.query(
      `CREATE INDEX "index_vendor_supported_countries_country_id" ON "vendor_supported_countries" ("country_id") `,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_supported_countries" ADD CONSTRAINT "vendor_supported_countries_vendor_id_fkey" FOREIGN KEY ("vendor_id") REFERENCES "vendors"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_supported_countries" ADD CONSTRAINT "vendor_supported_countries_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "vendor_supported_countries" DROP CONSTRAINT "vendor_supported_countries_country_id_fkey"`,
    );
    await queryRunner.query(
      `ALTER TABLE "vendor_supported_countries" DROP CONSTRAINT "vendor_supported_countries_vendor_id_fkey"`,
    );
    await queryRunner.query(`DROP INDEX "public"."index_vendor_supported_countries_country_id"`);
    await queryRunner.query(`DROP INDEX "public"."index_vendor_supported_countries_vendor_id"`);
    await queryRunner.query(`DROP TABLE "vendor_supported_countries"`);
    await queryRunner.query(`DROP TABLE "vendors"`);
    await queryRunner.query(`DROP TYPE "public"."service_type_enum"`);
  }
}
