ALTER TABLE `projects`
  ADD COLUMN `ownerEmail` VARCHAR(191) NULL,
  ADD COLUMN `demoExpiresAt` DATETIME(3) NULL,
  ADD COLUMN `quoteRequestedAt` DATETIME(3) NULL;

CREATE TABLE `email_verifications` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `codeHash` VARCHAR(191) NOT NULL,
  `attempts` INTEGER NOT NULL DEFAULT 0,
  `expiresAt` DATETIME(3) NOT NULL,
  `verifiedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `email_verifications_email_createdAt_idx`(`email`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `usage_counters` (
  `id` VARCHAR(191) NOT NULL,
  `scopeKey` VARCHAR(191) NOT NULL,
  `action` VARCHAR(191) NOT NULL,
  `count` INTEGER NOT NULL DEFAULT 0,
  `windowStart` DATETIME(3) NOT NULL,
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `usage_counters_scopeKey_action_key`(`scopeKey`, `action`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
