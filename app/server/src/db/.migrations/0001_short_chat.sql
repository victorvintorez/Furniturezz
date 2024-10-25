ALTER TABLE `users` RENAME COLUMN `password` TO `passwordHash`;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);