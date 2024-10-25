import { Elysia } from "elysia";

export const AuthController = new Elysia({ prefix: "/auth" })
	.post("/login", async (ctx) => {
		return ctx.redirect("/");
	})
	.post("/register", async (ctx) => {
		return ctx.redirect("/");
	})
	.get("/logout", async (ctx) => {
		return ctx.redirect("/");
	});
