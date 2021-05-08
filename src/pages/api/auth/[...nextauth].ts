import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import Providers from 'next-auth/providers';

const options: NextAuthOptions = {
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  session: {
    jwt: true,
  },
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  database: process.env.DATABASE_URL,
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session: async (session, user) => {
      // @ts-ignore
      session.user.id = user.id;

      return Promise.resolve(session);
    },
    jwt: async (token, user, account, profile, isNewUser) => {
      if (user) {
        // @ts-ignore
        token.id = user.id;
      }

      return Promise.resolve(token);
    },
  },
};

export default (req: NextApiRequest, res: NextApiResponse): void | Promise<void> =>
  NextAuth(req, res, options);
