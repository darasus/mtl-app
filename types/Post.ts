import Prisma from ".prisma/client";

export type Post = Prisma.Post & {
  author: Omit<Prisma.User, "password"> | null;
  commentsCount: number;
  likesCount: number;
  isLikedByMe: boolean;
  comments: (Prisma.Comment & {
    author?: Omit<Prisma.User, "password"> | null;
  })[];
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
};
