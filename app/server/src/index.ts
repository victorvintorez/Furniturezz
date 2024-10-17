import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { env } from "./utils/dotenv";

const app = new Elysia({ prefix: "/api" })
	.use(swagger())
	.get("/", () => "Hello Elysia")
	.listen(env.PORT);

console.log(
	`🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`,
);
