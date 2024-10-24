import { createConnection } from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { env } from "../utils/dotenv";
import { createClient } from "redis";
import { migrate } from "drizzle-orm/mysql2/migrator";

// Setup MySql DB and run migrations
const connection = await createConnection({
    host: env.MYSQL_HOST,
    port: env.MYSQL_PORT,
    user: env.MYSQL_USER,
    password: env.MYSQL_PASSWORD,
    database: env.MYSQL_DATABASE
});
const mysql = drizzle(connection, { casing: "snake_case" });
await migrate(mysql, { migrationsFolder: "./src/db/.migrations" });

// Setup KeyDB
const keydb = await createClient({
    socket: {
        host: env.KEYDB_HOST,
        port: env.KEYDB_PORT
    },
    username: env.KEYDB_USERNAME,
    password: env.KEYDB_PASSWORD
}).on("error", err => {
    console.error(`Redis Error: ${err}`);
    process.exit(1);
}).connect();

export { mysql, keydb };