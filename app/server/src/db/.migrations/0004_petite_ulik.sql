DROP TABLE `furniture_images`;--> statement-breakpoint
RENAME TABLE `furniture_details` TO `furniture`;--> statement-breakpoint
RENAME TABLE `documents` TO `images`;--> statement-breakpoint
ALTER TABLE `images` RENAME COLUMN `documentUrl` TO `imageUrl`;--> statement-breakpoint
ALTER TABLE `furniture` RENAME COLUMN `furnitureMake` TO `make`;--> statement-breakpoint
ALTER TABLE `furniture` RENAME COLUMN `furnitureModel` TO `model`;--> statement-breakpoint
ALTER TABLE `furniture` RENAME COLUMN `furnitureColor` TO `color`;--> statement-breakpoint
ALTER TABLE `furniture` RENAME COLUMN `furnitureType` TO `type`;--> statement-breakpoint
ALTER TABLE `furniture` RENAME COLUMN `videoId` TO `videoUrl`;--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `profileImageId` TO `profileImageUrl`;--> statement-breakpoint
ALTER TABLE `furniture` DROP FOREIGN KEY `furniture_details_userId_users_id_fk`;
--> statement-breakpoint
ALTER TABLE `furniture` DROP FOREIGN KEY `furniture_details_videoId_documents_id_fk`;
--> statement-breakpoint
ALTER TABLE `users` DROP FOREIGN KEY `users_profileImageId_documents_id_fk`;
--> statement-breakpoint
ALTER TABLE `images` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `furniture` DROP PRIMARY KEY;--> statement-breakpoint
ALTER TABLE `furniture` MODIFY COLUMN `videoUrl` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `profileImageUrl` varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE `images` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `furniture` ADD PRIMARY KEY(`id`);--> statement-breakpoint
ALTER TABLE `images` ADD `furnitureId` bigint unsigned NOT NULL;--> statement-breakpoint
ALTER TABLE `images` ADD CONSTRAINT `images_furnitureId_furniture_id_fk` FOREIGN KEY (`furnitureId`) REFERENCES `furniture`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `furniture` ADD CONSTRAINT `furniture_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `images` DROP COLUMN `documentType`;