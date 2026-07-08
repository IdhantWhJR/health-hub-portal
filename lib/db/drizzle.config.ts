import { defineConfig } from "drizzle-kit";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// drizzle-kit's glob resolver requires forward slashes even on Windows
const toPosix = (p: string) => p.split(path.sep).join("/");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL, ensure the database is provisioned");
}

export default defineConfig({
  schema: [
    toPosix(path.resolve(__dirname, "src/schema/blogs.ts")),
    toPosix(path.resolve(__dirname, "src/schema/bookings.ts")),
    toPosix(path.resolve(__dirname, "src/schema/recipes.ts")),
    toPosix(path.resolve(__dirname, "src/schema/timeslots.ts")),
  ],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
    ssl: "require",
  },
});
