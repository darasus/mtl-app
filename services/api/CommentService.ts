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
    take = 25,
    cursor,
  }: {
    postId: number;
    take?: number;
    cursor?: number;
  }) {
    const baseQuery = {
      where: {
        postId,
      },
    } as const;
    const [items, total] = await Promise.all([
      prisma.comment
        .findMany({
          ...baseQuery,
          ...(cursor
            ? {
                cursor: {
                  id: cursor,
                },
              }
            : {}),
          take,
          skip: cursor ? 1 : 0,
          orderBy: { id: "desc" },
          select: commentFragment,
        })
        .then((res) => res.reverse()),
      prisma.comment.count({
        ...baseQuery,
      }),
    ]);
    const lastCommentInResults = items[0];
    const newCursor = lastCommentInResults.id;

    return {
      items,
      count: items.length,
      total,
      cursor: newCursor,
    };
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
