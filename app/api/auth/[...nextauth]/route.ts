// import NextAuth from "next-auth/next";
// import { options } from "./options";
// import { getSession } from "next-auth/react";
// import type { GetServerSidePropsContext, GetServerSidePropsResult } from "next";

// const handler = NextAuth(options);

// export async function getServerSideProps(
//   context: GetServerSidePropsContext
// ): Promise<GetServerSidePropsResult<Record<string>>> {
//   const session = await getSession({ req: context.req });

//   const roles = (session?.user as any)?.roles as string[] | undefined;
//   if (!roles?.includes(process.env.AZURE_ADMIN_ROLE_ID as string)) {
//     return {
//       redirect: { destination: "/", permanent: false },
//     };
//   }

//   return { props: {} };
// }

// export { handler as GET, handler as POST };

// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { options } from "./options";
const handler = NextAuth(options);
export { handler as GET, handler as POST };
