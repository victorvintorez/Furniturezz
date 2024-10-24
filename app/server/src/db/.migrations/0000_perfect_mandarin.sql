CREATE TABLE `documents` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`documentType` text NOT NULL,
	`documentUrl` text NOT NULL,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `furniture_details` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`userId` bigint unsigned NOT NULL,
	`furnitureMake` text NOT NULL,
	`furnitureModel` text NOT NULL,
	`furnitureColor` text NOT NULL,
	`furnitureType` text NOT NULL,
	`location` text NOT NULL,
	`year` text NOT NULL,
	`videoUrl` bigint unsigned NOT NULL,
	`imageUrl` bigint unsigned NOT NULL,
	CONSTRAINT `furniture_details_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`username` varchar(255) NOT NULL,
	`password` text NOT NULL,
	`title` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`gender` text NOT NULL,
	`address1` text NOT NULL,
	`address2` text DEFAULT (''),
	`address3` text DEFAULT (''),
	`postcode` text NOT NULL,
	`description` text DEFAULT (''),
	`email` text NOT NULL,
	`telephone` text NOT NULL,
	`profileUrl` bigint unsigned NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_username_unique` UNIQUE(`username`)
);
--> statement-breakpoint
ALTER TABLE `furniture_details` ADD CONSTRAINT `furniture_details_userId_users_id_fk` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `furniture_details` ADD CONSTRAINT `furniture_details_videoUrl_documents_id_fk` FOREIGN KEY (`videoUrl`) REFERENCES `documents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `furniture_details` ADD CONSTRAINT `furniture_details_imageUrl_documents_id_fk` FOREIGN KEY (`imageUrl`) REFERENCES `documents`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_profileUrl_documents_id_fk` FOREIGN KEY (`profileUrl`) REFERENCES `documents`(`id`) ON DELETE no action ON UPDATE no action;