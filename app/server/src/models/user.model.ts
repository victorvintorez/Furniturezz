import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Table } from "../db/schema";
import { t } from "elysia";

export const UserModel = {
	select: createSelectSchema(Table.users),
	insert: createInsertSchema(Table.users, {
		title: t.String({ format: "title" }),
		gender: t.String({ format: "gender" }),
		postcode: t.String({ format: "uk-postcode" }),
		email: t.String({ format: "email" }),
		telephone: t.String({ format: "uk-telephone" }),
	}),
} as const;
