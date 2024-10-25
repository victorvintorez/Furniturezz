import { z } from "zod";

const envSchema = z.object({
	SERVER_PORT: z.number().optional().default(8000),
	MYSQL_HOST: z.string(),
	MYSQL_PORT: z.number().optional().default(3306),
	MYSQL_USER: z.string(),
	MYSQL_PASSWORD: z.string(),
	MYSQL_DATABASE: z.string(),
	KEYDB_HOST: z.string(),
	KEYDB_PORT: z.number().optional().default(6379),
	KEYDB_PASSWORD: z.string().optional(),
});

const envParse = envSchema.safeParse({
	SERVER_PORT:
		process.env.SERVER_PORT && Number.parseInt(process.env.SERVER_PORT),
	MYSQL_HOST: process.env.MYSQL_HOST,
	MYSQL_PORT: process.env.MYSQL_PORT && Number.parseInt(process.env.MYSQL_PORT),
	MYSQL_USER: process.env.MYSQL_USER,
	MYSQL_PASSWORD: process.env.MYSQL_PASSWORD,
	MYSQL_DATABASE: process.env.MYSQL_DATABASE,
	KEYDB_HOST: process.env.KEYDB_HOST,
	KEYDB_PORT: process.env.KEYDB_PORT && Number.parseInt(process.env.KEYDB_PORT),
	KEYDB_PASSWORD: process.env.KEYDB_PASSWORD,
});

if (!envParse.success) {
	throw new Error(
		`The following issues were found in the environment files:\n${envParse.error.issues.map((issue) => `${issue.code} - ${issue.path}: ${issue.message}`).join("\n")}`,
	);
}

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = envParse.data;
