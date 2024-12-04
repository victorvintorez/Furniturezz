import { logger } from "@bogeychan/elysia-logger";
import {eq} from "drizzle-orm";
import Elysia from "elysia";
import type {User} from "lucia";
import {mysql} from "../db/db.ts";
import {usersTable} from "../db/schema.ts";
import { AuthService } from "../services/auth.service";

export const UserController = new Elysia({ prefix: "/user" })
	.use(AuthService)
	.use(logger())
	.get("/", async ({ user, error, log }) => {
		user = user as User;
			try {
				const userDetails = await mysql.query.usersTable.findFirst({
					where: eq(usersTable.id, user.id),
				})
				if (!userDetails)
					return error(404, "User not found")

				return userDetails
			} catch (e) {
				log.error(e);
				return error(500, "Could not retrieve user details")
			}
	}, {
		requireAuth: true,
	});
