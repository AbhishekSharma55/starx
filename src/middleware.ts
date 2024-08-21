export { default } from "next-auth/middleware"

export const config = { matcher: ["/dashboard/:path*","/protected/:path*","/starxgpt/:path*"] }