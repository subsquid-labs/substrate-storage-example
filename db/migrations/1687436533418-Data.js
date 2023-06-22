module.exports = class Data1687436533418 {
    name = 'Data1687436533418'

    async up(db) {
        await db.query(`CREATE TABLE "era_nomination" ("id" character varying NOT NULL, "nominator_id" text NOT NULL, "amount" numeric NOT NULL, "era_id" character varying, "validator_id" character varying, CONSTRAINT "PK_4209193432151f1cbd32a32dc73" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_8d0f2c79f04ed0571d6d8f3f1c" ON "era_nomination" ("era_id") `)
        await db.query(`CREATE INDEX "IDX_8001c7914ea1cc7ebaf239b443" ON "era_nomination" ("validator_id") `)
        await db.query(`CREATE TABLE "era_validator" ("id" character varying NOT NULL, "validator_id" text NOT NULL, "self_bonded" numeric NOT NULL, "total_bonded" numeric NOT NULL, "nominators_count" integer NOT NULL, "era_id" character varying, CONSTRAINT "PK_a376bf1356eeeaf0a43f9f7ae3f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_0f3a1de891dea5ed228469dd5e" ON "era_validator" ("era_id") `)
        await db.query(`CREATE TABLE "era" ("id" character varying NOT NULL, "index" integer NOT NULL, "started_at" integer NOT NULL, CONSTRAINT "PK_a30749cdf0189d890a8dbc9aa7d" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "era_nomination" ADD CONSTRAINT "FK_8d0f2c79f04ed0571d6d8f3f1c5" FOREIGN KEY ("era_id") REFERENCES "era"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "era_nomination" ADD CONSTRAINT "FK_8001c7914ea1cc7ebaf239b4433" FOREIGN KEY ("validator_id") REFERENCES "era_validator"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "era_validator" ADD CONSTRAINT "FK_0f3a1de891dea5ed228469dd5e3" FOREIGN KEY ("era_id") REFERENCES "era"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "era_nomination"`)
        await db.query(`DROP INDEX "public"."IDX_8d0f2c79f04ed0571d6d8f3f1c"`)
        await db.query(`DROP INDEX "public"."IDX_8001c7914ea1cc7ebaf239b443"`)
        await db.query(`DROP TABLE "era_validator"`)
        await db.query(`DROP INDEX "public"."IDX_0f3a1de891dea5ed228469dd5e"`)
        await db.query(`DROP TABLE "era"`)
        await db.query(`ALTER TABLE "era_nomination" DROP CONSTRAINT "FK_8d0f2c79f04ed0571d6d8f3f1c5"`)
        await db.query(`ALTER TABLE "era_nomination" DROP CONSTRAINT "FK_8001c7914ea1cc7ebaf239b4433"`)
        await db.query(`ALTER TABLE "era_validator" DROP CONSTRAINT "FK_0f3a1de891dea5ed228469dd5e3"`)
    }
}
