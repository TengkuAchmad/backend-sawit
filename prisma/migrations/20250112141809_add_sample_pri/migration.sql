/*
  Warnings:

  - Added the required column `Type_MD` to the `ModelData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Sampel_PRI` to the `PalmResultIndex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ModelData` ADD COLUMN `Type_MD` ENUM('SCAN_TEST', 'LAB_TEST') NOT NULL;

-- AlterTable
ALTER TABLE `PalmResultIndex` ADD COLUMN `Sampel_PRI` VARCHAR(191) NOT NULL;
