import { Lucia, type Session, type User } from "lucia";
import { DrizzleMySqlAdapterWithKeyDb } from "../db/adapter";
import { keydb, mysql } from "../db/db";
import { usersTable } from "../db/schema";
import Elysia, { error } from "elysia";

const adapter = new DrizzleMySqlAdapterWithKeyDb(mysql, keydb, usersTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			email: attributes.email,
			profileUrl: attributes.profileImageId,
		};
	},
});

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		UserId: number;
		DatabaseUserAttributes: {
			username: string;
			email: string;
			profileImageId: number;
		};
	}
}

export const AuthService = new Elysia({ name: "Auth.Service" })
	.derive(
		async (ctx): Promise<{ user: User | null; session: Session | null }> => {
			const cookie = ctx.request.headers.get("Cookie") ?? "";
			const sessionId = lucia.readSessionCookie(cookie);
			if (!sessionId) return { user: null, session: null };

			const { session, user } = await lucia.validateSession(sessionId);

			if (session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(session.id);
				ctx.cookie[sessionCookie.name].set({
					value: sessionCookie.value,
					...sessionCookie.attributes,
				});
			}

			if (!session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				ctx.cookie[sessionCookie.name].set({
					value: sessionCookie.value,
					...sessionCookie.attributes,
				});
			}

			return { user: user, session: session };
		},
	)
	.macro(({ onBeforeHandle }) => ({
		isSignedIn() {
			onBeforeHandle(({ user }) => {
				if (!user) return error(401, "Unauthorized");
			});
		},
	}))
	.as("plugin");
