import { useQuery } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const createUseMeQueryCacheKey = () => ["me"];

export const useMeQuery = () => {
  const fetcher = new Fetcher();

  return useQuery(createUseMeQueryCacheKey(), fetcher.getMe, {
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
};
