ALTER TABLE `projects`
  ADD COLUMN `accessToken` VARCHAR(191) NULL,
  ADD COLUMN `status` VARCHAR(191) NOT NULL DEFAULT 'NEW',
  ADD COLUMN `adminNotes` TEXT NULL,
  ADD COLUMN `estimatedPrice` INTEGER NULL,
  ADD COLUMN `finalPrice` INTEGER NULL;

UPDATE `projects` SET `accessToken` = UUID() WHERE `accessToken` IS NULL;
ALTER TABLE `projects` MODIFY `accessToken` VARCHAR(191) NOT NULL;
CREATE UNIQUE INDEX `projects_accessToken_key` ON `projects`(`accessToken`);
