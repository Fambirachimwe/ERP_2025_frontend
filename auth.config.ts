import { NextAuthConfig, Session } from "next-auth";
import type { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";

declare module "next-auth" {
    interface User {
        _id: string;
        firstName: string;
        lastName: string;
        department: string;
        roles: string[];
        accessToken: string;
    }

    interface Session {
        user: User & {
            id: string;
            email: string;
            name?: string | null;
            image?: string | null;
        };
    }
}

export const authConfig: NextAuthConfig = {
    pages: {
        signIn: "/login",
    },
    providers: [
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                console.log("Credentials:", credentials);
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(credentials),
                    });

                    const data = await response.json();

                    if (!response.ok) {
                        throw new Error(data.message || "Invalid credentials");
                    }

                    return {
                        id: data.user._id,
                        _id: data.user._id,
                        email: data.user.email,
                        name: `${data.user.firstName} ${data.user.lastName}`,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        department: data.user.department,
                        roles: data.user.roles,
                        accessToken: data.token,
                    };
                } catch (error: any) {
                    console.error("Auth Error:", error);
                    return null;
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                return {
                    ...token,
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    department: user.department,
                    roles: user.roles,
                    accessToken: user.accessToken,
                };
            }
            return token;
        },
        async session({ session, token }): Promise<Session> {
            return {
                ...session,
                user: {
                    ...session.user,
                    _id: token._id as string,
                    firstName: token.firstName as string,
                    lastName: token.lastName as string,
                    department: token.department as string,
                    roles: token.roles as string[],
                    accessToken: token.accessToken as string,
                },
            };
        },
    },
    session: { strategy: "jwt" },
};
