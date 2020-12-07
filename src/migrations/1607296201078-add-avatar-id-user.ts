import {MigrationInterface, QueryRunner} from "typeorm";

export class addAvatarIdUser1607296201078 implements MigrationInterface {
    name = 'addAvatarIdUser1607296201078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "avatarId" uuid`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5" UNIQUE ("avatarId")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "file"("id") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarId"`);
    }

}
