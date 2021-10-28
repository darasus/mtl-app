import { createUseTagsQueryQueryCacheKey } from "../../hooks/query/useTagsQuery";
import prisma from "../prisma";
import cache from "../cache";
import { days } from "../../utils/duration";

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
      days(365)
    );
  }
}
