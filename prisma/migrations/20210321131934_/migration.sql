/*
  Warnings:

  - You are about to drop the column `name` on the `users` table. All the data in the column will be lost.
  - The migration will add a unique constraint covering the columns `[userName]` on the table `users`. If there are existing duplicate values, the migration will fail.
  - Made the column `email` on table `users` required. The migration will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `name`,
    ADD COLUMN     `firstName` VARCHAR(191),
    ADD COLUMN     `lastName` VARCHAR(191),
    ADD COLUMN     `userName` VARCHAR(191),
    MODIFY `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `users.userName_unique` ON `users`(`userName`);
