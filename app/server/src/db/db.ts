import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { env } from "../utils/dotenv";
import Redis from "ioredis";

// Setup Sqlite DB and run migrations
const bunSqlite = new Database(env.SQLITE_FILE, { create: true });
const sqlite = drizzle(bunSqlite, { casing: "snake_case" });
migrate(sqlite, { migrationsFolder: "./src/db/.migrations" });

// Setup KeyDB
const keydb = new Redis({
    host: env.KEYDB_HOST,
    port: env.KEYDB_PORT,
    username: env.KEYDB_USERNAME,
    password: env.KEYDB_PASSWORD,
})
export { sqlite, keydb };