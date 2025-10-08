import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { auth } from "@/server/auth/auth";

export const authClient = createAuthClient({
  /** The base URL of the server (optional if you're using the same domain) */
  // baseURL: env.BETTER_AUTH_URL
  plugins: [customSessionClient<typeof auth>()],
});

export type Session = typeof authClient.$Infer.Session;
