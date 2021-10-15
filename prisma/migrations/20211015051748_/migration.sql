-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Follow` DROP FOREIGN KEY `Follow_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_ibfk_2`;

-- DropForeignKey
ALTER TABLE `Like` DROP FOREIGN KEY `Like_ibfk_1`;

-- DropForeignKey
ALTER TABLE `Post` DROP FOREIGN KEY `Post_ibfk_1`;

-- AddForeignKey
ALTER TABLE `Post` ADD CONSTRAINT `Post_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_postId_fkey` FOREIGN KEY (`postId`) REFERENCES `Post`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Like` ADD CONSTRAINT `Like_authorId_fkey` FOREIGN KEY (`authorId`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followerId_fkey` FOREIGN KEY (`followerId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Follow` ADD CONSTRAINT `Follow_followingId_fkey` FOREIGN KEY (`followingId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- RenameIndex
ALTER TABLE `accounts` RENAME INDEX `accounts.compound_id_unique` TO `accounts_compound_id_key`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `sessions.access_token_unique` TO `sessions_access_token_key`;

-- RenameIndex
ALTER TABLE `sessions` RENAME INDEX `sessions.session_token_unique` TO `sessions_session_token_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `users.email_unique` TO `users_email_key`;

-- RenameIndex
ALTER TABLE `users` RENAME INDEX `users.userName_unique` TO `users_userName_key`;

-- RenameIndex
ALTER TABLE `verification_requests` RENAME INDEX `verification_requests.token_unique` TO `verification_requests_token_key`;
