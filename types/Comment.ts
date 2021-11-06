import Prisma from ".prisma/client";

export type Comment = Prisma.Comment & {
  author?: Prisma.User | null;
  isMyComment: boolean;
};
