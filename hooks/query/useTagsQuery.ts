import { useQuery } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const createUseTagsQueryQueryCacheKey = () => ["tags"];

export const useTagsQuery = () => {
  const fetcher = new Fetcher();

  return useQuery(
    createUseTagsQueryQueryCacheKey(),
    () => fetcher.getAllTags(),
    {
      staleTime: 1000 * 60 * 60,
    }
  );
};
