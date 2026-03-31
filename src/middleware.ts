export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/api/student/:path*",
        "/api/attendance/:path*",
        "/api/finance/:path*",
    ],
};
