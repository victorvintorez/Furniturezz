import Elysia from "elysia";
import { AuthService } from "../services/auth.service";
import { logger } from "@bogeychan/elysia-logger";
import type {User} from "lucia";
import {mysql} from "../db/db.ts";
import {documentsTable, usersTable} from "../db/schema.ts";
import {eq} from "drizzle-orm";

export const UserController = new Elysia({ prefix: "/user" })
	.use(AuthService)
	.use(logger())
	.get("/", async ({ user, error, log }) => {
		user = user as User;
			try {
				const userDetails = await mysql.select({
					username: usersTable.username,
					title: usersTable.title,
					firstName: usersTable.firstName,
					lastName: usersTable.lastName,
					gender: usersTable.gender,
					address1: usersTable.address1,
					address2: usersTable.address2,
					address3: usersTable.address3,
					postcode: usersTable.postcode,
					description: usersTable.description,
					email: usersTable.email,
					telephone: usersTable.telephone,
					profileImageId: usersTable.profileImageId,
				}).from(usersTable).where(eq(usersTable.id, user.id))

				try {
					const imageUrl = await mysql.select({
						documentUrl: documentsTable.documentUrl,
					}).from(documentsTable).where(eq(documentsTable.id, userDetails[0].profileImageId))

					return {
						username: userDetails[0].username,
						title: userDetails[0].title,
						firstName: userDetails[0].firstName,
						lastName: userDetails[0].lastName,
						gender: userDetails[0].gender,
						address1: userDetails[0].address1,
						address2: userDetails[0].address2,
						address3: userDetails[0].address3,
						postcode: userDetails[0].postcode,
						description: userDetails[0].description,
						email: userDetails[0].email,
						telephone: userDetails[0].telephone,
						profileImageUrl: imageUrl[0].documentUrl
					}
				} catch (e) {
					log.error(e);
					return error(500, "Could not retrieve user profile image")
				}
			} catch (e) {
				log.error(e);
				return error(500, "Could not retrieve user details")
			}
	}, {
		requireAuth: true,
	});
