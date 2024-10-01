import { z, ZodError } from "zod";
import { configDotenv } from "dotenv";
import parseDuration from "parse-duration";
import consola from "consola";

configDotenv();

const env = z.object({
  JWT_SECRET: z.string(),
  JWT_EXPIRES_IN: z
    .string()
    .min(1)
    .transform((d) => parseDuration(d))
    .refine((n) => !!n),
  PORT: z
    .string()
    .optional()
    .transform(Number)
    .refine((n) => !isNaN(n)),
  NODE_ENV: z.enum(["development", "production", "test"]).optional(),
  DATABASE_URL: z.string(),
  DEFAULT_USER_PASSWORD: z.string(),
});

type Env = z.infer<typeof env>;

let parsedEnv: Env;

try {
  parsedEnv = env.parse(process.env);
} catch (error) {
  if (error instanceof ZodError) {
    consola.error("🛑 Failed to parse environment variables 🛑 ");

    error.errors.forEach((err) => {
      consola.warn(
        `⚠️  Invalid or missing environment variable: `,
        err.path.join("."),
      );
    });
  }

  process.exit(1);
}

export default parsedEnv;
