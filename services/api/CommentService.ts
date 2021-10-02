import { Session } from "next-auth";
import prisma from "../../lib/prisma";

export class CommentService {
  session: Session | null;

  constructor({ session }: { session: Session | null }) {
    this.session = session;
  }

  async isMyComment(commentId: number) {
    const comment = await prisma.comment.findFirst({
      where: {
        id: commentId,
      },
      include: {
        author: true,
      },
    });

    console.log(comment);

    return comment?.author?.email === this.session?.user?.email;
  }

  async deleteComment(commentId: number) {
    return prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }
}
