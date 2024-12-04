import {furnitureTable, imagesTable, usersTable} from "./schema.ts";

export const Table = {
	users: usersTable,
	furniture: furnitureTable,
	images: imagesTable,
} as const;

export type Table = typeof Table;