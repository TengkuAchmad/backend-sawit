/*
  Warnings:

  - A unique constraint covering the columns `[Title_RI]` on the table `ResultIndex` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ResultIndex_Title_RI_key` ON `ResultIndex`(`Title_RI`);
