import { Lucia } from "lucia";
import { DrizzleSqliteAdapterWithKeyDb } from "../db/adapter";
import { keydb, sqlite } from "../db/db";
import { usersTable } from "../db/schema";

const adapter = new DrizzleSqliteAdapterWithKeyDb(sqlite, keydb, usersTable)

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production",
		}
	}
})

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		UserId: number;
	}
}
