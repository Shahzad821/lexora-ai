import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL || process.env.DB_URL;

if (!databaseUrl) {
  throw new Error("Missing required environment variable: DATABASE_URL or DB_URL");
}

const sql = neon(databaseUrl);

export default sql;
