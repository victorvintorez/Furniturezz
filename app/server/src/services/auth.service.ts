import { Lucia, type Session, type User } from "lucia";
import { DrizzleSqliteAdapterWithKeyDb } from "../db/adapter";
import { keydb, sqlite } from "../db/db";
import { usersTable } from "../db/schema";
import Elysia, { error } from "elysia";

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

export const AuthService = new Elysia({ name: "Auth.Service" })
	.derive( async (context): Promise<{ user: User | null; session: Session | null; }> => {
		const cookie = context.request.headers.get("Cookie") ?? "";
		const sessionId = lucia.readSessionCookie(cookie);
		if (!sessionId) return { user: null, session: null };

		const { session, user } = await lucia.validateSession(sessionId);

		if (session?.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			context.cookie[sessionCookie.name].set({
				value: sessionCookie.value,
				...sessionCookie.attributes
			})
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			context.cookie[sessionCookie.name].set({
				value: sessionCookie.value,
				...sessionCookie.attributes
			})
		}

		return { user, session };
	}).macro(({ onBeforeHandle }) => ({
		isSignedIn() {
			onBeforeHandle(({ user }) => {
				if (!user) return error(401, "Unauthorized");
			})
		}
	}))
