import { Session } from "next-auth";
import prisma from "../../lib/prisma";

export class FollowService {
  session: Session | null;

  constructor({ session }: { session: Session | null }) {
    this.session = session;
  }

  async getNumberOfFollowers(userId: number) {
    return prisma.follow.count({
      where: {
        follower: {
          email: this.session?.user?.email as string,
        },
      },
    });
  }
}
