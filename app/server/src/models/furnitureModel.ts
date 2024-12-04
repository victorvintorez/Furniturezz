import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Table } from "../db/tables";

export const FurnitureModel = {
	select: createSelectSchema(Table.furniture),
	insert: createInsertSchema(Table.furniture),
} as const;
