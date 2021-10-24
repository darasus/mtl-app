import { useQuery } from "react-query";
import { useFetcher } from "../useFetcher";

export const createUseMeQueryCacheKey = () => ["me"];

export const useMeQuery = () => {
  const fetcher = useFetcher();

  return useQuery(createUseMeQueryCacheKey(), fetcher.getMe, {
    keepPreviousData: true,
    refetchOnWindowFocus: false,
  });
};
