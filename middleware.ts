// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  (req) => {
    const roles = (req.nextauth?.token as any)?.roles as string[] | undefined;
    if (!roles?.includes(process.env.AZURE_ADMIN_ROLE_ID!)) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  { callbacks: { authorized: ({ token }) => !!token } }
);

export const config = { matcher: ["/admin/:path*"] };


// export {default} from "next-auth/middleware";