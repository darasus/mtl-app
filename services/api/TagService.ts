import { createUseTagsQueryQueryCacheKey } from "../../hooks/query/useTagsQuery";
import prisma from "../../lib/prisma";
import cache from "../../server/cache";

export class TagService {
  async getAllTags() {
    return cache.fetch(
      JSON.stringify(createUseTagsQueryQueryCacheKey()),
      () =>
        prisma.tag.findMany({
          select: {
            id: true,
            name: true,
            createdAt: true,
            updatedAt: true,
          },
        }),
      60 * 60 * 24
    );
  }
}
