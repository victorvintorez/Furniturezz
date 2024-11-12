import { Elysia } from "elysia";
import { env } from "./utils/dotenv";
import { AuthService } from "./services/auth.service";
import swagger from "@elysiajs/swagger";
import { serveSpa } from "./utils/serveSpa";
import { AuthController } from "./controllers/auth.controller";
import { logger } from "@bogeychan/elysia-logger";

const app = new Elysia()
	.use(swagger())
	.use(
		logger({
			transport: {
				target: "pino-pretty",
				options: {
					colorize: true,
				},
			},
		}),
	)
	.use(serveSpa)
	.use(AuthService)
	.group("/api", (app) => app.use(AuthController))
	.listen(env.SERVER_PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
