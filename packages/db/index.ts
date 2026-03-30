import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { account, session, user, verification } from './schema/auth-schema';

const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    account,
    session,
    user,
    verification,
  },
});
export { db };