/*
  Warnings:

  - Made the column `content` on table `Comment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Comment` MODIFY `content` LONGTEXT NOT NULL;
