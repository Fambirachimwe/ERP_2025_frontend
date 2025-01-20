import NextAuth from "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            _id: string;
            firstName: string;
            lastName: string;
            department: string;
            roles: string[];
            accessToken: string;
            email: string;
        };
    }

    interface User {
        id: string;
        email: string;
        name: string;
        firstName: string;
        lastName: string;
        roles: string[];
        department: string;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        _id: string;
        roles: string[];
        accessToken: string;
        department: string;
    }
} 