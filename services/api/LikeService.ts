import { Session } from "next-auth";
import prisma from "../../lib/prisma";
import { commentFragment } from "../fragments/commentFragment";

export class LikeService {
  session: Session | null | undefined;

  constructor({ session }: { session?: Session | null }) {
    this.session = session;
  }

  async likePost(postId: number) {
    await prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        author: { connect: { email: this.session?.user?.email! } },
      },
    });
  }

  async unlikePost(postId: number) {
    const like = await prisma.like.findFirst({
      where: {
        postId,
        author: {
          email: this.session?.user?.email!,
        },
      },
    });
    await prisma.like.delete({
      where: {
        id: like?.id,
      },
    });
  }
}
