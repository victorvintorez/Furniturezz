CREATE TABLE `documents` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`documentType` varchar(255) NOT NULL,
	`documentUrl` varchar(255) NOT NULL,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `furniture_details` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`furnitureMake` varchar(255) NOT NULL,
	`furnitureModel` varchar(255) NOT NULL,
	`furnitureColor` varchar(255) NOT NULL,
	`furnitureType` varchar(255) NOT NULL,
	`location` varchar(255) NOT NULL,
	`year` varchar(255) NOT NULL,
	`videoId` bigint unsigned NOT NULL,
	`imageId` bigint unsigned NOT NULL,
	CONSTRAINT `furniture_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`passwordHash` varchar(255) NOT NULL,
	`title` varchar(255) NOT NULL,
	`firstName` varchar(255) NOT NULL,
	`lastName` varchar(255) NOT NULL,
	`gender` varchar(255) NOT NULL,
	`address1` varchar(255) NOT NULL,
	`address2` varchar(255) DEFAULT '',
	`address3` varchar(255) DEFAULT '',
	`postcode` varchar(255) NOT NULL,
	`description` varchar(255) DEFAULT '',
	`email` varchar(255) NOT NULL,
	`telephone` varchar(255) NOT NULL,
	`profileImageId` bigint unsigned NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
--> statement-breakpoint
ALTER TABLE `furniture_details` ADD CONSTRAINT `furniture_details_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `furniture_details` ADD CONSTRAINT `furniture_details_videoId_documents_id_fk` FOREIGN KEY (`videoId`) REFERENCES `documents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `furniture_details` ADD CONSTRAINT `furniture_details_imageId_documents_id_fk` FOREIGN KEY (`imageId`) REFERENCES `documents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_profileImageId_documents_id_fk` FOREIGN KEY (`profileImageId`) REFERENCES `documents`(`id`) ON DELETE no action ON UPDATE no action;