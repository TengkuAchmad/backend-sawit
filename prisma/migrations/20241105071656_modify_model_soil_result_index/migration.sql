/*
  Warnings:

  - Added the required column `Genangan_SORI` to the `SoilResultIndex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SoilResultIndex` ADD COLUMN `Genangan_SORI` VARCHAR(191) NOT NULL;
