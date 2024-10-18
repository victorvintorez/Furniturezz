import { createInsertSchema, createSelectSchema } from "drizzle-typebox";
import { Table } from "../db/schema";

export const FurnitureDetailsModel = {
    select: createSelectSchema(Table.furniture_details),
    insert: createInsertSchema(Table.furniture_details),
} as const;