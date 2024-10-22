/*
  Warnings:

  - Added the required column `Url_AD` to the `AppData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `AppData` ADD COLUMN `Url_AD` TEXT NOT NULL,
    MODIFY `Description_AD` TEXT NOT NULL;
