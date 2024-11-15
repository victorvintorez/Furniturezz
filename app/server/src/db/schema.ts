import {
	bigint,
	serial,
	mysqlTable as table,
	varchar,
} from "drizzle-orm/mysql-core";

// users table schema
export const usersTable = table("users", {
	id: serial().primaryKey(),
	username: varchar({ length: 255 }).notNull().unique(),
	passwordHash: varchar({ length: 255 }).notNull(),
	title: varchar({ length: 255 }).notNull(),
	firstName: varchar({ length: 255 }).notNull(),
	lastName: varchar({ length: 255 }).notNull(),
	gender: varchar({ length: 255 }).notNull(),
	address1: varchar({ length: 255 }).notNull(),
	address2: varchar({ length: 255 }).default(""),
	address3: varchar({ length: 255 }).default(""),
	postcode: varchar({ length: 255 }).notNull(),
	description: varchar({ length: 255 }).default(""),
	email: varchar({ length: 255 }).notNull().unique(),
	telephone: varchar({ length: 255 }).notNull(),
	profileImageId: bigint({ mode: "number", unsigned: true })
		.notNull()
		.references(() => documentsTable.id),
});

export const furnitureDetailsTable = table("furniture_details", {
	id: serial().primaryKey(),
	userId: bigint({ mode: "number", unsigned: true })
		.notNull()
		.references(() => usersTable.id),
	furnitureMake: varchar({ length: 255 }).notNull(),
	furnitureModel: varchar({ length: 255 }).notNull(),
	furnitureColor: varchar({ length: 255 }).notNull(),
	furnitureType: varchar({ length: 255 }).notNull(),
	location: varchar({ length: 255 }).notNull(),
	year: varchar({ length: 255 }).notNull(),
	videoId: bigint({ mode: "number", unsigned: true })
		.notNull()
		.references(() => documentsTable.id),
});

export const documentsTable = table("documents", {
	id: serial().primaryKey(),
	documentType: varchar({ length: 255 }).notNull(),
	documentUrl: varchar({ length: 255 }).notNull(),
});

export const furnitureImagesTable = table("furniture_images", {
	id: serial().primaryKey(),
	furnitureId: bigint({ mode: "number", unsigned: true })
		.notNull()
		.references(() => furnitureDetailsTable.id),
	imageId: bigint({ mode: "number", unsigned: true })
		.notNull()
		.references(() => documentsTable.id),
});

export const Table = {
	users: usersTable,
	furniture_details: furnitureDetailsTable,
	documents: documentsTable,
	furniture_images: furnitureImagesTable,
} as const;

export type Table = typeof Table;
