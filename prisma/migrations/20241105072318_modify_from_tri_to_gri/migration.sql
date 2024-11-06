/*
  Warnings:

  - You are about to drop the column `Max_TRI` on the `GelombangResultIndex` table. All the data in the column will be lost.
  - You are about to drop the column `Min_TRI` on the `GelombangResultIndex` table. All the data in the column will be lost.
  - Added the required column `Max_GRI` to the `GelombangResultIndex` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Min_GRI` to the `GelombangResultIndex` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `GelombangResultIndex` DROP COLUMN `Max_TRI`,
    DROP COLUMN `Min_TRI`,
    ADD COLUMN `Max_GRI` DOUBLE NOT NULL,
    ADD COLUMN `Min_GRI` DOUBLE NOT NULL;
