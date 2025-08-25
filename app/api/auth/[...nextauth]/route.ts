import NextAuth from "next-auth/next";
import {options} from "./options";
import { getSession } from 'next-auth/react';

const handler = NextAuth(options);
export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user.roles.includes(process.env.AZURE_ADMIN_ROLE_ID)) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {}, // will be passed to the page component as props
  };
}
export {handler as GET, handler as POST}