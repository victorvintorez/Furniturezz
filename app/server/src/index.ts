import { Elysia } from "elysia";
import { env } from "./utils/dotenv";
import { AuthService } from "./services/auth.service";

const app = new Elysia({ prefix: "/api" })
	.use(AuthService)
	.get("/", "Hello Elysia")
	.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
