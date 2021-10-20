import { useQuery } from "react-query";
import { useFetcher } from "../useFetcher";

export const createUseTagsQueryQueryCacheKey = () => ["tags"];

export const useTagsQuery = () => {
  const fetcher = useFetcher();

  return useQuery(
    createUseTagsQueryQueryCacheKey(),
    () => fetcher.getAllTags(),
    {
      staleTime: 1000 * 60 * 60,
    }
  );
};
