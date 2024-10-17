import { Database } from "bun:sqlite";
import { drizzle } from "drizzle-orm/bun-sqlite";
import { migrate } from "drizzle-orm/bun-sqlite/migrator";
import { env } from "../utils/dotenv";
import Redis from "ioredis";

// Setup Sqlite DB and run migrations
const bunSqlite = new Database(env.SQLITE_PATH, { create: true });
const sqlite = drizzle(bunSqlite, { casing: "snake_case" });
migrate(sqlite, { migrationsFolder: "./src/db/.migrations" });

// Setup KeyDB
const keydb = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    username: env.REDIS_USERNAME,
    password: env.REDIS_PASSWORD,
})
export { sqlite, keydb };