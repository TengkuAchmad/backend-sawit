/*
  Warnings:

  - You are about to drop the column `UUID_SRI` on the `ResultIndex` table. All the data in the column will be lost.
  - You are about to drop the column `Desa_SRI` on the `SocialResultIndex` table. All the data in the column will be lost.
  - You are about to drop the column `Umur_SORI` on the `SoilResultIndex` table. All the data in the column will be lost.
  - Added the required column `Umur_SRI` to the `SocialResultIndex` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `ResultIndex` DROP FOREIGN KEY `ResultIndex_UUID_SRI_fkey`;

-- AlterTable
ALTER TABLE `ResultData` ADD COLUMN `Confidence_RD` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `ResultIndex` DROP COLUMN `UUID_SRI`,
    MODIFY `UUID_SORI` VARCHAR(191) NULL,
    MODIFY `UUID_PRI` VARCHAR(191) NULL,
    MODIFY `UUID_TRI` VARCHAR(191) NULL,
    MODIFY `UUID_GRI` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `SocialResultIndex` DROP COLUMN `Desa_SRI`,
    ADD COLUMN `UUID_RI` VARCHAR(191) NULL,
    ADD COLUMN `Umur_SRI` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `SoilResultIndex` DROP COLUMN `Umur_SORI`,
    MODIFY `Lereng_SORI` VARCHAR(191) NULL,
    MODIFY `Drainase_SORI` VARCHAR(191) NULL,
    MODIFY `Topografi_SORI` VARCHAR(191) NULL,
    MODIFY `BahayaErosi_SORI` VARCHAR(191) NULL,
    MODIFY `BatuanPer_SORI` VARCHAR(191) NULL,
    MODIFY `BatuanSin_SORI` VARCHAR(191) NULL,
    MODIFY `Ketinggian_SORI` VARCHAR(191) NULL,
    MODIFY `Genangan_SORI` VARCHAR(191) NULL;

-- AddForeignKey
ALTER TABLE `SocialResultIndex` ADD CONSTRAINT `SocialResultIndex_UUID_RI_fkey` FOREIGN KEY (`UUID_RI`) REFERENCES `ResultIndex`(`UUID_RI`) ON DELETE NO ACTION ON UPDATE NO ACTION;
