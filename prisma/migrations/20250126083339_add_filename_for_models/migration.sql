/*
  Warnings:

  - Added the required column `FileName_MD` to the `ModelData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ModelData` ADD COLUMN `FileName_MD` VARCHAR(191) NOT NULL;
