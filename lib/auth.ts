import type { NextAuthConfig } from "next-auth";
import type { JWT } from "next-auth/jwt";
import CredentialsProvider from "next-auth/providers/credentials";
import { fetchApi } from "./utils";

interface ExtendedJWT extends JWT {
    roles: string[];
    accessToken: string;
}

interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    department: string;
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
                        _id: data.user._id,
                        firstName: data.user.firstName,
                        lastName: data.user.lastName,
                        email: data.user.email,
                        department: data.user.department,
                        roles: data.user.roles,
                        accessToken: data.token,
                    } as User;
                } catch (error: any) {
                    throw new Error(error.message || "Invalid credentials");
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.roles = user.roles;
                token._id = user._id;
                token.firstName = user.firstName;
                token.lastName = user.lastName;
                token.department = user.department;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
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
                }
            };
        }
    },
}; 