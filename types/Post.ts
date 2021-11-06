import Prisma from ".prisma/client";
import { Comment } from "./Comment";

export type Post = Prisma.Post & {
  author?: Prisma.User | null;
  commentsCount: number;
  likesCount: number;
  isLikedByMe: boolean;
  comments: Comment[];
  tags: (Prisma.TagsOnPosts & { tag: Prisma.Tag })[];
  isMyPost: boolean;
};
