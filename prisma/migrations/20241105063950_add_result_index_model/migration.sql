/*
  Warnings:

  - You are about to drop the column `Latitude_RD` on the `ResultData` table. All the data in the column will be lost.
  - You are about to drop the column `Longitude_RD` on the `ResultData` table. All the data in the column will be lost.
  - You are about to drop the column `Result_RD` on the `ResultData` table. All the data in the column will be lost.
  - Added the required column `UUID_RI` to the `ResultData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ResultData` DROP COLUMN `Latitude_RD`,
    DROP COLUMN `Longitude_RD`,
    DROP COLUMN `Result_RD`,
    ADD COLUMN `UUID_RI` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `ResultIndex` (
    `UUID_RI` VARCHAR(191) NOT NULL,
    `UUID_SRI` VARCHAR(191) NOT NULL,
    `UUID_SORI` VARCHAR(191) NOT NULL,
    `UUID_PRI` VARCHAR(191) NOT NULL,
    `UUID_TRI` VARCHAR(191) NOT NULL,
    `UUID_GRI` VARCHAR(191) NOT NULL,
    `Title_RI` VARCHAR(191) NOT NULL,
    `CreatedAt_RI` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `UpdatedAt_RI` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`UUID_RI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SocialResultIndex` (
    `UUID_SRI` VARCHAR(191) NOT NULL,
    `Longitude_SRI` DOUBLE NOT NULL,
    `Latitude_SRI` DOUBLE NOT NULL,
    `Kabupaten_SRI` VARCHAR(191) NOT NULL,
    `Desa_SRI` VARCHAR(191) NOT NULL,
    `Kecamatan_SRI` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UUID_SRI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SoilResultIndex` (
    `UUID_SORI` VARCHAR(191) NOT NULL,
    `Umur_SORI` VARCHAR(191) NOT NULL,
    `Lereng_SORI` VARCHAR(191) NOT NULL,
    `Drainase_SORI` VARCHAR(191) NOT NULL,
    `Topografi_SORI` VARCHAR(191) NOT NULL,
    `BahayaErosi_SORI` VARCHAR(191) NOT NULL,
    `BatuanPer_SORI` VARCHAR(191) NOT NULL,
    `BatuanSin_SORI` VARCHAR(191) NOT NULL,
    `Ketinggian_SORI` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UUID_SORI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PalmResultIndex` (
    `UUID_PRI` VARCHAR(191) NOT NULL,
    `ALB_PRI` DOUBLE NOT NULL,
    `Rendemen_PRI` DOUBLE NOT NULL,
    `Densitas_PRI` DOUBLE NOT NULL,

    PRIMARY KEY (`UUID_PRI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TransmittanResultIndex` (
    `UUID_TRI` VARCHAR(191) NOT NULL,
    `Min_TRI` DOUBLE NOT NULL,
    `Max_TRI` DOUBLE NOT NULL,

    PRIMARY KEY (`UUID_TRI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GelombangResultIndex` (
    `UUID_GRI` VARCHAR(191) NOT NULL,
    `Min_TRI` DOUBLE NOT NULL,
    `Max_TRI` DOUBLE NOT NULL,

    PRIMARY KEY (`UUID_GRI`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ResultData` ADD CONSTRAINT `ResultData_UUID_RI_fkey` FOREIGN KEY (`UUID_RI`) REFERENCES `ResultIndex`(`UUID_RI`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ResultIndex` ADD CONSTRAINT `ResultIndex_UUID_SRI_fkey` FOREIGN KEY (`UUID_SRI`) REFERENCES `SocialResultIndex`(`UUID_SRI`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ResultIndex` ADD CONSTRAINT `ResultIndex_UUID_SORI_fkey` FOREIGN KEY (`UUID_SORI`) REFERENCES `SoilResultIndex`(`UUID_SORI`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ResultIndex` ADD CONSTRAINT `ResultIndex_UUID_PRI_fkey` FOREIGN KEY (`UUID_PRI`) REFERENCES `PalmResultIndex`(`UUID_PRI`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ResultIndex` ADD CONSTRAINT `ResultIndex_UUID_TRI_fkey` FOREIGN KEY (`UUID_TRI`) REFERENCES `TransmittanResultIndex`(`UUID_TRI`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `ResultIndex` ADD CONSTRAINT `ResultIndex_UUID_GRI_fkey` FOREIGN KEY (`UUID_GRI`) REFERENCES `GelombangResultIndex`(`UUID_GRI`) ON DELETE NO ACTION ON UPDATE NO ACTION;
