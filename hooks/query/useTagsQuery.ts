import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const useTagsQuery = () => {
  const fetcher = useFetcher();

  return useQuery(clientCacheKey.tagsBaseKey, () => fetcher.getAllTags(), {
    staleTime: 1000 * 60 * 60,
  });
};
