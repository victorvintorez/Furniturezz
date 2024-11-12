import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Table } from "../db/schema";
import { t } from "elysia";
import { formats } from "../utils/formats";

export const UserModel = {
	select: createSelectSchema(Table.users),
	insert: createInsertSchema(Table.users, {
		title: formats.IsValidTitle,
		gender: formats.IsValidGender,
		postcode: formats.IsUkPostcode,
		email: t.String({ format: "email", default: "" }),
		telephone: formats.IsUkTelephone,
	}),
} as const;
