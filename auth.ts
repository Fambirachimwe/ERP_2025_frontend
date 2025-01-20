import NextAuth, { AuthError } from "next-auth"
import { authConfig } from "./auth.config"

export class CustomAuthError extends AuthError {
    constructor(msg: string) {
        super();
        this.message = msg;
        this.stack = undefined;
    }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
    secret: process.env.AUTH_SECRET,
    ...authConfig,
}) 