import Prisma, { Like, User } from ".prisma/client";
import { Post } from "../../types/Post";
import * as R from "ramda";

export type InputPost = Prisma.Post & {
  likes: (Prisma.Like & { author: Prisma.User | null })[];
  comments: Prisma.Comment[];
  commentsCount: number;
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
};

export const preparePost = (post: InputPost, userId?: number): Post => {
  const isLikedByMe = userId
    ? post.likes.some(
        (like: Like & { author: User | null }) => like.author?.id === userId
      )
    : false;

  return {
    ...R.omit(["likes"], post),
    likesCount: post.likes.length,
    isLikedByMe,
  };
};
