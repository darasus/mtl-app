import { useQuery } from "react-query";
import { fetchMe } from "../../request/fetchMe";

export const createUseMeQueryCacheKey = () => ["me"];

export const useMeQuery = () => {
  return useQuery(createUseMeQueryCacheKey(), fetchMe, {
    staleTime: 1000 * 60 * 5,
    keepPreviousData: true,
  });
};
