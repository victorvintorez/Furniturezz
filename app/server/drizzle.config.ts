import { defineConfig } from "drizzle-kit";
import { env } from "./src/utils/dotenv";

export default defineConfig({
	out: "./src/db/.migrations",
	schema: "./src/db/schema.ts",
	dialect: "mysql",
	dbCredentials: {
		host: env.MYSQL_HOST,
		port: env.MYSQL_PORT,
		user: env.MYSQL_USER,
		password: env.MYSQL_PASSWORD,
		database: env.MYSQL_DATABASE,
	},
});
