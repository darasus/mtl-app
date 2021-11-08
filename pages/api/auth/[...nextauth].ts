import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import Adapters from "next-auth/adapters";
import { UserService } from "../../../lib/prismaServices/UserService";
import prisma from "../../../lib/prisma";
import bcrypt from "bcrypt";

const authHandler: NextApiHandler = (req, res) =>
  NextAuth(req, res, {
    providers: [
      Providers.GitHub({
        clientId: process.env.GITHUB_ID,
        clientSecret: process.env.GITHUB_SECRET,
        scope: "read:user, user:email",
      }),
      Providers.Credentials({
        name: "Credentials",
        credentials: {
          email: {
            label: "Email",
            type: "text",
            placeholder: "example.example.com",
          },
          firstName: {
            label: "First name",
            type: "text",
            placeholder: "John",
          },
          lastName: {
            label: "Last name",
            type: "text",
            placeholder: "Doe",
          },
        } as any,
        authorize: async (credentials) => {
          if (process.env.SECRET_TEST_ENV === "true") {
            const user = await prisma.user.findFirst({
              where: {
                email: credentials?.email,
              },
            });

            return user;
          }

          const user = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
          });

          if (!user && credentials?.firstName) {
            return prisma.user.create({
              data: {
                email: credentials?.email,
                password: await bcrypt.hash(credentials?.password, 10),
                name: `${credentials.firstName} ${credentials.lastName}`,
                image: "/user-image.png",
              },
            });
          }

          const isPassCorrect = await bcrypt.compare(
            credentials?.password as string,
            user?.password as string
          );

          if (user && isPassCorrect) {
            return Promise.resolve(user);
          } else {
            throw new Error(
              "Email and password combination doesn't match with our database records, please try again..."
            );
          }
        },
      }),
    ],
    adapter: Adapters.Prisma.Adapter({ prisma }),
    secret: process.env.SECRET,
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
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
