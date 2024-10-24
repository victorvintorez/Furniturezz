import { bigint, serial, mysqlTable as table, text, varchar } from "drizzle-orm/mysql-core";

// users table schema
export const usersTable = table("users", {
	id: serial().primaryKey(),
	username: varchar({ length: 255 }).notNull().unique(),
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
	profileUrl: bigint({ mode: 'number', unsigned: true })
		.notNull()
		.references(() => documentsTable.id),
});

export const furnitureDetailsTable = table("furniture_details", {
	id: serial().primaryKey(),
	userId: bigint({ mode: 'number', unsigned: true })
		.notNull()
		.references(() => usersTable.id),
	furnitureMake: text().notNull(),
	furnitureModel: text().notNull(),
	furnitureColor: text().notNull(),
	furnitureType: text().notNull(),
	location: text().notNull(),
	year: text().notNull(),
	videoUrl: bigint({ mode: 'number', unsigned: true })
		.notNull()
		.references(() => documentsTable.id),
	imageUrl: bigint({ mode: 'number', unsigned: true })
		.notNull()
		.references(() => documentsTable.id),
});

export const documentsTable = table("documents", {
	id: serial().primaryKey(),
	documentType: text().notNull(),
	documentUrl: text().notNull(),
})

export const Table = {
	users: usersTable,
	furniture_details: furnitureDetailsTable,
} as const;

export type Table = typeof Table;
