import "next-auth";

declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            role: string;
            unitId: string | null;
            unitName: string | null;
        } & DefaultSession["user"];
    }

    interface User {
        id: string;
        role: string;
        unitId: string | null;
        unitName?: string | null;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role: string;
        unitId: string | null;
        unitName?: string | null;
    }
}
