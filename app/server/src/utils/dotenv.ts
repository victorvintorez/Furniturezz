import { z } from "zod";

const envSchema = z.object({
	PORT: z.number().optional().default(8000),
	SQLITE_PATH: z.string(),
	REDIS_HOST: z.string(),
	REDIS_PORT: z.number().optional().default(6379),
	REDIS_USERNAME: z.string().optional(),
	REDIS_PASSWORD: z.string().optional(),
});

const envParse = envSchema.safeParse({
	PORT: process.env.PORT && Number.parseInt(process.env.PORT),
	SQLITE_PATH: process.env.SQLITE_PATH,
	REDIS_HOST: process.env.REDIS_HOST,
	REDIS_PORT: process.env.REDIS_PORT && Number.parseInt(process.env.REDIS_PORT),
	REDIS_USERNAME: process.env.REDIS_USERNAME,
	REDIS_PASSWORD: process.env.REDIS_PASSWORD,
});

if (!envParse.success) {
	throw new Error(
		`The following issues were found in the environment files:\n${envParse.error.issues.map((issue) => `${issue.code} - ${issue.path}: ${issue.message}`).join("\n")}`,
	);
}

type EnvType = z.infer<typeof envSchema>;

export const env: EnvType = envParse.data;
