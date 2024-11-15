import { Lucia, type Session, type User } from "lucia";
import { DrizzleMySqlAdapterWithKeyDb } from "../db/adapter";
import { keydb, mysql } from "../db/db";
import { usersTable } from "../db/schema";
import Elysia, { error } from "elysia";

const adapter = new DrizzleMySqlAdapterWithKeyDb(mysql, keydb, usersTable);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		name: "session",
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => {
		return {
			username: attributes.username,
			email: attributes.email,
			profileImageUrl: attributes.profileImageUrl,
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
			profileImageUrl: string;
		};
	}
}

export const AuthService = new Elysia({ name: "Auth.Service" })
	.resolve(
		async ({
			cookie,
			request,
		}): Promise<{ user: User | null; session: Session | null }> => {
			const sessionCookie = request.headers.get("Cookie") ?? "";

			const sessionId = lucia.readSessionCookie(sessionCookie);

			if (!sessionId) return { user: null, session: null };

			const { session, user } = await lucia.validateSession(sessionId);

			if (session?.fresh) {
				const sessionCookie = lucia.createSessionCookie(session.id);
				cookie[sessionCookie.name].set({
					value: sessionCookie.value,
					...sessionCookie.attributes,
				});
			}

			if (!session) {
				const sessionCookie = lucia.createBlankSessionCookie();
				cookie[sessionCookie.name].set({
					value: sessionCookie.value,
					...sessionCookie.attributes,
				});
			}

			return { user: user, session: session };
		},
	)
	.macro(({ onBeforeHandle }) => ({
		requireAuth(enabled: boolean) {
			if (!enabled) return;
			onBeforeHandle(({ user }) => {
				if (!user) return error(401, "Unauthorized");
			});
		},
		requireAnonymous(enabled: boolean) {
			if (!enabled) return;
			onBeforeHandle(({ user }) => {
				if (user) return error(401, "Already Logged In");
			});
		},
	}))
	.as("plugin");
