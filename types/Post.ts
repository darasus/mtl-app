import Prisma from ".prisma/client";

export type Post = Prisma.Post & {
  author?: Prisma.User | null;
  likes: number;
  isLikedByMe: boolean;
  comments: (Prisma.Comment & { author?: Prisma.User | null })[];
};
