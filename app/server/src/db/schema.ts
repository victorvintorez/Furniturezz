import { blob, int, sqliteTable as table, text } from "drizzle-orm/sqlite-core";

// users table schema
export const usersTable = table("users", {
	id: int().primaryKey({ autoIncrement: true }),
	username: text().notNull().unique(),
	password: text().notNull(),
	title: text().notNull(),
	firstName: text().notNull(),
	lastName: text().notNull(),
	gender: text().notNull(),
	address1: text().notNull(),
	address2: text().default(""),
	address3: text().default(""),
	postcode: text().notNull(),
	description: text().default(""),
	email: text().notNull(),
	telephone: text().notNull(),
	profileBlob: blob(),
	profileUrl: text().default(""),
});

export const furnitureDetailsTable = table("furniture_details", {
	furniture_id: int().primaryKey({ autoIncrement: true }),
	user_id: int()
		.notNull()
		.references(() => usersTable.id),
	furniture_make: text().notNull(),
	furniture_model: text().notNull(),
	furniture_color: text().notNull(),
	furniture_type: text().notNull(),
	location: text().notNull(),
	year: text().notNull(),
	video_url: text().default(""),
	image_url: text().default(""),
});

export const Table = {
	users: usersTable,
	furniture_details: furnitureDetailsTable,
} as const;

export type Table = typeof Table;
