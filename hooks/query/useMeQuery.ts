import { useQuery } from "react-query";
import { useFetcher } from "../useFetcher";

export const createUseMeQueryCacheKey = () => ["me"];

export const useMeQuery = () => {
  const fetcher = useFetcher();

  return useQuery(createUseMeQueryCacheKey(), fetcher.getMe, {
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
};
