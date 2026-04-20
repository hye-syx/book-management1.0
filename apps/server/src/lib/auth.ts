import { db } from '@repo/db'; // your drizzle instance
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN;

export const auth = betterAuth({
  baseURL: BETTER_AUTH_URL,
  trustedOrigins: FRONTEND_ORIGIN ? [FRONTEND_ORIGIN] : undefined,
  database: drizzleAdapter(db, {
    provider: 'pg', // or "mysql", "sqlite"
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  user: {
    additionalFields: {
      role: {
        type: ['admin', 'librarian', 'reader'],
        defaultValue: 'reader',
        input: false,
      },
    },
  },
});
