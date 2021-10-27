import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import prisma from "../../../lib/prisma";
import { UserService } from "../../../lib/api/UserService";

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        scope: "read:user, user:email",
      }),
    ],
    adapter: Adapters.Prisma.Adapter({ prisma }),
    secret: process.env.SECRET,
    pages: {
      signIn: "/auth/signin",
    },
    session: {
      jwt: true,
      maxAge: 30 * 24 * 60 * 60,
      updateAge: 24 * 60 * 60,
    },
    callbacks: {
      async session(session) {
        const { user } = session;

        if (user && user.email) {
          const userService = new UserService();
          const dbUser = await userService.getUserByEmail(user.email);

          if (dbUser) {
            return { ...session, ...dbUser };
          }
        }

        return session;
      },
    },
  });
export default authHandler;
