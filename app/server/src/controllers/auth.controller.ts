import { unlink } from "node:fs/promises";
import { logger } from "@bogeychan/elysia-logger";
import { hash, password } from "bun";
import { eq, or } from "drizzle-orm";
import { Elysia, t } from "elysia";
import { mysql } from "../db/db";
import {usersTable } from "../db/schema";
import { UserModel } from "../models/user.model";
import { AuthService, lucia } from "../services/auth.service";
import { formats } from "../utils/formats";

export const AuthController = new Elysia({ prefix: "/auth" })
	.use(AuthService)
	.use(logger())
	.post(
		"/login",
		async ({ body, error, cookie, log }) => {
			const queriedUser = await mysql.query.usersTable.findFirst({
				where: or(
					eq(usersTable.username, body.username),
					eq(usersTable.email, body.username),
				),
			})

			if(!queriedUser) {
				return error(400, "Invalid Username/Email");
			}

			const unhashPassword = await password.verify(
				body.password,
				queriedUser.passwordHash,
				"argon2id",
			);

			if (!unhashPassword) {
				return error(400, "Invalid Password");
			}

			try {
				// Create new session cookie
				const session = await lucia.createSession(queriedUser.id, {});
				const sessionCookie = lucia.createSessionCookie(session.id);
				cookie[sessionCookie.name].set({
					value: sessionCookie.value,
					...sessionCookie.attributes,
				});

				// 200 OK
				return;
			} catch (e) {
				log.error(e);
				return error(500, "Error Creating Session - Try Logging In");
			}
		},
		{
			requireAnonymous: true,
			body: t.Object({
				username: t.String(),
				password: formats.IsValidPassword,
			}),
		},
	)
	.post(
		"/register",
		async ({ body, error, cookie, log }) => {
			// Check username and email are available
			const usernameExists = await mysql.$count(
				usersTable,
				eq(usersTable.username, body.username),
			);
			if (usernameExists > 0) {
				return error(400, "Username Unavailable");
			}

			// Check email is available
			const emailExists = await mysql.$count(
				usersTable,
				eq(usersTable.email, body.email),
			);
			if (emailExists > 0) {
				return error(400, "Email Already in use. Did you mean to Login?");
			}

			const passwordHash = await password.hash(body.password, {
				algorithm: "argon2id",
				memoryCost: 32768, // 32MiB
				timeCost: 2,
			});

			try {
				// Save document in filesystem
				const profileUrl = `./www/upload/profileImage/${body.username}-${hash(await body.profileImage.arrayBuffer())}.${body.profileImage.name.split(".").pop()}`;
				await Bun.write(profileUrl, await body.profileImage.arrayBuffer());

				try {
					// Save user in database
					const user = await mysql
						.insert(usersTable)
						.values({
							username: body.username,
							passwordHash,
							title: body.title,
							firstName: body.firstName,
							lastName: body.lastName,
							gender: body.gender,
							address1: body.address1,
							address2: body.address2,
							address3: body.address3,
							postcode: body.postcode,
							description: body.description,
							email: body.email,
							telephone: body.telephone,
							profileImageUrl: profileUrl.replace("./www", ""),
						})
						.$returningId();

					try {
						// Create new session cookie
						const session = await lucia.createSession(user[0].id, {});
						const sessionCookie = lucia.createSessionCookie(session.id);
						cookie[sessionCookie.name].set({
							value: sessionCookie.value,
							...sessionCookie.attributes,
						});

						// 200 OK
						return;
					} catch (e) {
						log.error(e);
						return error(500, "Error Creating Session - Try Logging In");
					}
				} catch (e) {
					await unlink(profileUrl);
					log.error(e);
					return error(400, "Error Saving User - User may already exist");
				}
			} catch (e) {
				log.error(e);
				return error(500, "Error Saving Profile Image");
			}
		},
		{
			requireAnonymous: true,
			body: t.Composite([
				t.Omit(UserModel.insert, ["id", "passwordHash", "profileImageUrl"]),
				t.Object({
					password: formats.IsValidPassword,
					profileImage: t.File({ type: "image", maxSize: "10m" }),
				}),
			]),
		},
	)
	.get("/logout", async ({ error, cookie, session }) => {
		if (!session) {
			return error(401, "Already Logged Out");
		}

		await lucia.invalidateSession(session.id);

		const sessionCookie = lucia.createBlankSessionCookie();
		cookie[sessionCookie.name].set({
			value: sessionCookie.value,
			...sessionCookie.attributes,
		});

		// 200 OK
		return;
	});
