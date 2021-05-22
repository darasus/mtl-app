import prisma from "../lib/prisma";

export const getUserByUsername = (userName: string) => {
  return prisma.user.findUnique({
    where: {
      userName,
    },
    select: {
      userName: true,
      email: true,
      id: true,
      image: true,
      name: true,
      emailVerified: true,
      posts: {
        where: {
          published: true,
        },
        select: {
          id: true,
          content: true,
          description: true,
          title: true,
          published: true,
        },
      },
    },
  });
};
