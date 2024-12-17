import { logger } from "@bogeychan/elysia-logger";
import swagger from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { AuthController } from "./controllers/auth.controller";
import { FurnitureDetailsController } from "./controllers/furnitureDetails.controller";
import { UserController } from "./controllers/user.controller";
import { AuthService } from "./services/auth.service";
import { env } from "./utils/dotenv";
import { serveSpa } from "./utils/serveSpa";

const app = new Elysia()
	.use(swagger())
	.use(logger())
	.use(serveSpa)
	.use(AuthService)
	.group("/api", (app) =>
		app.use(AuthController).use(UserController).use(FurnitureDetailsController),
	)
	.listen(env.SERVER_PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
