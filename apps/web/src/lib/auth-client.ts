import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export function clearStoredAuthToken() {
  localStorage.removeItem('bearer_token');
}

export const authClient = createAuthClient({
   fetchOptions: {
        auth: {
           type:"Bearer",
           token: () => localStorage.getItem("bearer_token") || "" // get the token from localStorage
        },
        onSuccess: (ctx) => {
            const authToken = ctx.response.headers.get("set-auth-token") // get the token from the response headers
            // Store the token securely (e.g., in localStorage)
            if(authToken){
              localStorage.setItem("bearer_token", authToken);
            }
        }
    },
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

export const { signIn, signUp, useSession } = authClient;
