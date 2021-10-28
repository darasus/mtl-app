import prisma from "../prisma";

export class TagService {
  async getAllTags() {
    return prisma.tag.findMany({
      select: {
        id: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
