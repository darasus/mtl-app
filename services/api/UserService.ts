import { NextApiRequest } from "next";
import { Session } from "next-auth";
import prisma from "../../lib/prisma";

const selectQueryFragment = {
  select: {
    userName: true,
    email: true,
    id: true,
    image: true,
    name: true,
    emailVerified: true,
    createdAt: true,
    updatedAt: true,
  },
};

export class UserService {
  session: Session | null;

  constructor({ session }: { session: Session | null }) {
    this.session = session;
  }

  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      ...selectQueryFragment,
    });
  }

  async getUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: {
        email,
      },
      ...selectQueryFragment,
    });
  }

  async followUser(followingUserId: number) {
    await prisma.follow.create({
      data: {
        follower: {
          connect: {
            email: this.session?.user?.email as string,
          },
        },
        following: {
          connect: {
            id: followingUserId,
          },
        },
      },
    });
  }
}
