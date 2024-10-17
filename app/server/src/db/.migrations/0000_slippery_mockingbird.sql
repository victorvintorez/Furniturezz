CREATE TABLE `furniture_details` (
	`furniture_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`furniture_make` text NOT NULL,
	`furniture_model` text NOT NULL,
	`furniture_color` text NOT NULL,
	`furniture_type` text NOT NULL,
	`location` text NOT NULL,
	`year` text NOT NULL,
	`video_url` text DEFAULT '',
	`image_url` text DEFAULT '',
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`username` text NOT NULL,
	`password` text NOT NULL,
	`title` text NOT NULL,
	`firstName` text NOT NULL,
	`lastName` text NOT NULL,
	`gender` text NOT NULL,
	`address1` text NOT NULL,
	`address2` text DEFAULT '',
	`address3` text DEFAULT '',
	`postcode` text NOT NULL,
	`description` text DEFAULT '',
	`email` text NOT NULL,
	`telephone` text NOT NULL,
	`profileBlob` blob,
	`profileUrl` text DEFAULT ''
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);