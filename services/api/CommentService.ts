import { Session } from "next-auth";
import { createUsePostQueryCacheKey } from "../../hooks/query/usePostQuery";
import prisma from "../../lib/prisma";
import cache from "../../server/cache";
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

  async deleteComment(commentId: number, postId: number) {
    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    await cache.del(JSON.stringify(createUsePostQueryCacheKey(postId)));
  }

  async getCommentsByPostId({
    postId,
    take = 5,
    skip = 0,
  }: {
    postId: number;
    take?: number;
    skip?: number;
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
          take,
          skip,
          orderBy: { id: "desc" },
          select: commentFragment,
        })
        .then((res) => res.reverse()),
      prisma.comment.count({
        ...baseQuery,
      }),
    ]);

    return {
      items,
      count: items.length,
      total,
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

    await cache.del(JSON.stringify(createUsePostQueryCacheKey(postId)));
  }
}
