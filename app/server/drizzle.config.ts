import { defineConfig } from "drizzle-kit";
import { env } from "./src/utils/dotenv";

export default defineConfig({
	out: "./src/db/.migrations",
	schema: "./src/db/schema.ts",
	dialect: "sqlite",
	dbCredentials: {
		url: env.DB_PATH,
	},
});
