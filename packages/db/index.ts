import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { account, session, user, verification } from './schema/auth-schema';
import { bookCategory, books } from './schema/book-schema';

import {
  borrowApplications,
  borrowRecords,
  renewalRecords,
} from './schema/borrow-schema';

const db = drizzle(process.env.DATABASE_URL!, {
  schema: {
    account,
    session,
    user,
    verification,
    books,
    bookCategory,
    borrowApplications,
    borrowRecords,
    renewalRecords,
  },
});

export { db };
