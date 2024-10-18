import { z } from "zod";

const envSchema = z.object({
	PORT: z.number().optional().default(8000),
	SQLITE_FILE: z.string(),
	KEYDB_HOST: z.string(),
	KEYDB_PORT: z.number().optional().default(6379),
	KEYDB_USERNAME: z.string().optional(),
	KEYDB_PASSWORD: z.string().optional(),
});

const envParse = envSchema.safeParse({
	PORT: process.env.PORT && Number.parseInt(process.env.PORT),
	SQLITE_FILE: process.env.SQLITE_FILE,
	KEYDB_HOST: process.env.KEYDB_HOST,
	KEYDB_PORT: process.env.KEYDB_PORT && Number.parseInt(process.env.KEYDB_PORT),
	KEYDB_USERNAME: process.env.KEYDB_USERNAME,
	KEYDB_PASSWORD: process.env.KEYDB_PASSWORD,
});

if (!envParse.success) {
	throw new Error(
		`The following issues were found in the environment files:\n${envParse.error.issues.map((issue) => `${issue.code} - ${issue.path}: ${issue.message}`).join("\n")}`,
	);
}

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = envParse.data;
