/*
  Warnings:

  - Added the required column `PhotoUrl_UD` to the `UserData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserData` ADD COLUMN `PhotoUrl_UD` TEXT NOT NULL;
