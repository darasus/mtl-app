import { createUsePostQueryCacheKey } from "../../hooks/query/usePostQuery";
import prisma from "../../lib/prisma";
import cache from "../../server/cache";

export class LikeService {
  async likePost(postId: number, userId: number) {
    await prisma.like.create({
      data: {
        post: { connect: { id: postId } },
        author: { connect: { id: userId } },
      },
    });
  }

  async unlikePost(postId: number, userId: number) {
    const like = await prisma.like.findFirst({
      where: {
        postId,
        author: {
          id: userId,
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
