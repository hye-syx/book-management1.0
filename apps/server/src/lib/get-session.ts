import { auth } from "./auth";

export const getSession = async (headers: Headers) => {
  const session = await auth.api.getSession({
    headers,
  });
  return session;
};