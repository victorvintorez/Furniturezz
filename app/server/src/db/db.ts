import { drizzle } from "drizzle-orm/mysql2";
import { migrate } from "drizzle-orm/mysql2/migrator";
import { createConnection } from "mysql2/promise";
import { createClient } from "redis";
import { env } from "../utils/dotenv";
import * as schema from "./schema";

// Setup MySql DB and run migrations
const connection = await createConnection({
	host: env.MYSQL_HOST,
	port: env.MYSQL_PORT,
	user: env.MYSQL_USER,
	password: env.MYSQL_PASSWORD,
	database: env.MYSQL_DATABASE,
});
const mysql = drizzle(connection, {
	mode: "default",
	schema,
});
await migrate(mysql, { migrationsFolder: "./src/db/.migrations" });

// Setup KeyDB
const keydb = await createClient({
	socket: {
		host: env.KEYDB_HOST,
		port: env.KEYDB_PORT,
	},
	password: env.KEYDB_PASSWORD,
})
	.on("error", (err) => {
		console.error(`Redis Error: ${err}`);
		process.exit(1);
	})
	.connect();

export { mysql, keydb };
