import NextAuth from "next-auth";
import { cache } from "react";

import { authConfig } from "./config";

const { auth: uncachedAuth, handlers, signOut } = NextAuth(authConfig);

const auth = cache(uncachedAuth);

export { auth, handlers, signOut };
