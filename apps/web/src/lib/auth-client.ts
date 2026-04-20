import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';
export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  baseURL: 'https://book-server-pwnahbfons.cn-shenzhen.fcapp.run',
  plugins: [
    inferAdditionalFields({
      user: {
        role: {
          type: ['admin', 'librarian', 'reader'],
          defaultValue: 'reader',
          input: false,
        },
      },
    }),
  ],
});
export const { signIn, signUp, useSession } = createAuthClient();
