CREATE TABLE `furniture_images` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`furnitureId` bigint unsigned NOT NULL,
	`imageId` bigint unsigned NOT NULL,
	CONSTRAINT `furniture_images_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `furniture_details` DROP FOREIGN KEY `furniture_details_imageId_documents_id_fk`;
--> statement-breakpoint
ALTER TABLE `furniture_images` ADD CONSTRAINT `furniture_images_furnitureId_furniture_details_id_fk` FOREIGN KEY (`furnitureId`) REFERENCES `furniture_details`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `furniture_images` ADD CONSTRAINT `furniture_images_imageId_documents_id_fk` FOREIGN KEY (`imageId`) REFERENCES `documents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `furniture_details` DROP COLUMN `imageId`;