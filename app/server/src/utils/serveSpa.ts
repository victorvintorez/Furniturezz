import Elysia from "elysia";

export const serveSpa = new Elysia({ name: "serveSpa" }).get(
	"/*",
	async (ctx) => {
		const index = Bun.file("./www/index.html");
		const path = Bun.file(`./www/${ctx.path}`);
		return (await path.exists()) ? path : index;
	},
);
