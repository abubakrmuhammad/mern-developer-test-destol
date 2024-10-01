import parsedEnv from "@/env";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient({
  log:
    parsedEnv.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["query"],
});

export default db;
