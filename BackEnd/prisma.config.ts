import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "src/shared/prisma/schema.prisma",
  migrations: {
    path: "src/shared/prisma/migrations",
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});