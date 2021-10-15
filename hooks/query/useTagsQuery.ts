import { useQuery } from "react-query";
import { getAllTags } from "../../request/getAllTags";

export const createUseTagsQueryQueryCacheKey = () => ["tags"];

export const useTagsQuery = () => {
  return useQuery(createUseTagsQueryQueryCacheKey(), () => getAllTags(), {
    staleTime: 1000 * 60 * 60,
  });
};
