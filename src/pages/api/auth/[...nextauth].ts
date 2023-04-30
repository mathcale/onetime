import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';
import { UpstashRedisAdapter } from '@next-auth/upstash-redis-adapter';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.AUTH_DATABASE_URL,
  token: process.env.AUTH_DATABASE_TOKEN,
});

const options: NextAuthOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  ],
  jwt: {
    secret: process.env.NEXTAUTH_JWT_SECRET,
  },
  adapter: UpstashRedisAdapter(redis),
  debug: process.env.NODE_ENV === 'development',
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    session: async ({ session, user }) => {
      // @ts-ignore
      session.user.id = user.id;

      return Promise.resolve(session);
    },
    jwt: async ({ token, user }) => {
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
