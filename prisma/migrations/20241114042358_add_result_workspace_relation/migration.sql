/*
  Warnings:

  - Added the required column `UUID_WD` to the `ResultData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ResultData` ADD COLUMN `UUID_WD` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ResultData` ADD CONSTRAINT `ResultData_UUID_WD_fkey` FOREIGN KEY (`UUID_WD`) REFERENCES `WorkspaceData`(`UUID_WD`) ON DELETE NO ACTION ON UPDATE NO ACTION;
