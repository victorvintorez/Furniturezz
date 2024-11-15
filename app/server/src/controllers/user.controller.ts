import Elysia from "elysia";
import { AuthService } from "../services/auth.service";
import { logger } from "@bogeychan/elysia-logger";

export const UserController = new Elysia({ prefix: "/user" })
	.use(AuthService)
	.use(logger())
	.get("/", ({ user }) => user, {
		requireAuth: true,
	});
