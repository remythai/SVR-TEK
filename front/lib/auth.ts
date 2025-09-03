import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db/drizzle";
import { nextCookies } from "better-auth/next-js";
import { authUsers, authAccounts, authSessions, authVerifications } from "@/db/schema";

export const auth = betterAuth({
    emailAndPassword: {
      enabled: true,
    },
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
        user: authUsers,
        account: authAccounts,
        session: authSessions,
        verification: authVerifications,
      },
    }),
    plugins: [nextCookies()]
});