// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   schema: "./drizzle/schema.ts",
//   out: "./drizzle/migrations",
//   dialect: "mysql",
//   dbCredentials: {
//     host: "localhost",
//     user: "root",
//     password: undefined, // <-- ini penting!
//     database: "testdatamjs", // ganti sesuai nama database kamu
//   },
// });


import type { Config } from 'drizzle-kit';

export default {
  schema: './db/schema.ts',
  out: './drizzle',
  dialect: "mysql",
  dbCredentials: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: undefined,
    database: 'testdatamjs',
  },
} satisfies Config;
