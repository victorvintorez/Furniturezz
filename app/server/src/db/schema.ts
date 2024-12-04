import {relations} from "drizzle-orm";
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
	profileImageUrl: varchar({ length: 255 }).notNull(),
});

export const furnitureTable = table("furniture", {
	id: serial().primaryKey(),
	userId: bigint({ mode: "number", unsigned: true })
		.notNull()
		.references(() => usersTable.id),
	make: varchar({ length: 255 }).notNull(),
	model: varchar({ length: 255 }).notNull(),
	color: varchar({ length: 255 }).notNull(),
	type: varchar({ length: 255 }).notNull(),
	location: varchar({ length: 255 }).notNull(),
	year: varchar({ length: 255 }).notNull(),
	videoUrl: varchar({ length: 255 }).notNull(),
});

export const imagesTable = table("images", {
	id: serial().primaryKey(),
	furnitureId: bigint({ mode: "number", unsigned: true })
		.notNull()
		.references(() => furnitureTable.id),
	imageUrl: varchar({ length: 255 }).notNull(),
});

export const userFurnitureRelations = relations(usersTable, ({ many }) => ({
	furniture: many(furnitureTable)
}));

export const furnitureUserRelations = relations(furnitureTable, ({ one, many }) => ({
	user: one(usersTable, {
		fields: [furnitureTable.userId],
		references: [usersTable.id],
	}),
	images: many(imagesTable)
}));

export const imageFurnitureRelations = relations(imagesTable, ({ one }) => ({
	furniture: one(furnitureTable, {
		fields: [imagesTable.furnitureId],
		references: [furnitureTable.id],
	})
}));
