import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchApi } from "./utils";

interface ExtendedJWT extends JWT {
    roles: string[];
    accessToken: string;
}

export const authOptions: NextAuthConfig = {
    pages: {
        signIn: "/login",
    },
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password required");
                }

                try {
                    const data = await fetchApi("/auth/login", {
                        method: "POST",
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    return {
                        id: data.user._id,
                        email: data.user.email,
                        name: `${data.user.firstName} ${data.user.lastName}`,
                        roles: data.user.roles,
                        accessToken: data.token,
                    };
                } catch (error: any) {
                    throw new Error(error.message || "Invalid credentials");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                (token as ExtendedJWT).roles = user.roles as string[];
                (token as ExtendedJWT).accessToken = user.accessToken as string;
            }
            return token;
        },
        async session({ session, token }) {
            const jwtToken = token as ExtendedJWT;
            session.user.roles = jwtToken.roles ?? [];
            session.user.accessToken = jwtToken.accessToken ?? "";
            return session;
        },
    },
}; 