import invariant from "invariant";
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
  async getUserById(id: number) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      ...selectQueryFragment,
    });
  }
}
