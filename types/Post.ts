import Prisma from ".prisma/client";

export type Post = Prisma.Post & { author?: Prisma.User | null };
