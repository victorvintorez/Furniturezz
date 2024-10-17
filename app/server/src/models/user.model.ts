import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Table } from "../db/schema";

export const UserModel = {
	select: createSelectSchema(Table.users),
	insert: createInsertSchema(Table.users),
} as const;
