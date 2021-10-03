import { Session } from "next-auth";
import prisma from "../../lib/prisma";
import { commentFragment } from "../fragments/commentFragment";

export class CommentService {
  session: Session | null | undefined;

  constructor({ session }: { session?: Session | null }) {
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

    return comment?.author?.email === this.session?.user?.email;
  }

  async deleteComment(commentId: number) {
    return prisma.comment.delete({
      where: {
        id: commentId,
      },
    });
  }

  async getCommentsByPostId({
    postId,
    take,
    skip,
  }: {
    postId: number;
    take?: number;
    skip?: number;
  }) {
    const baseQuery = {
      where: {
        postId,
      },
      orderBy: { createdAt: "desc" },
      take: take || 25,
      skip: skip || 0,
    } as const;
    const [items, count, total] = await Promise.all([
      prisma.comment
        .findMany({
          ...baseQuery,
          select: commentFragment,
        })
        .then((res) => res.reverse()),
      prisma.comment.count({
        ...baseQuery,
      }),
      prisma.comment.count({
        ...baseQuery,
        take: undefined,
        skip: undefined,
      }),
    ]);

    console.log(items);

    return { items, count, total };
  }

  async addComment({ content, postId }: { content: string; postId: number }) {
    await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: postId } },
        author: { connect: { email: this.session?.user?.email! } },
      },
    });
  }
}
