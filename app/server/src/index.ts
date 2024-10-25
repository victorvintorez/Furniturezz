import { Elysia, error } from "elysia";
import { env } from "./utils/dotenv";
import { AuthService } from "./services/auth.service";
import swagger from "@elysiajs/swagger";
import { serveSpa } from "./utils/serveSpa";

const app = new Elysia()
	.use(swagger())
	.use(AuthService)
	.use(serveSpa)
	.group("/api", (app) => app.get("/hello", "Hello API"))
	.onError((ctx) => {
		console.log(ctx.error);
		return error(500, "Internal Server Error");
	})
	.listen(env.SERVER_PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
