import { Elysia } from "elysia";
import { env } from "./utils/dotenv";
import { AuthService } from "./services/auth.service";
import swagger from "@elysiajs/swagger";

const app = new Elysia({ prefix: "/api" })
	.use(swagger())
	.use(AuthService)
	.get("/", "Hello Elysia")
	.listen(env.SERVER_PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
