import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            department: string;
            roles: string[];
            accessToken: string;
        } & DefaultSession["user"];
    }

    interface User {
        _id: string;
        roles: string[];
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        roles: string[];
        accessToken: string;
    }
} 