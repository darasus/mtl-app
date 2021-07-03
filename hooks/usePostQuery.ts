import { useQuery } from "react-query";
import { fetchPost } from "../request/fetchPost";

const createUsePostQueryCacheKey = (id: number) => ["post", id];

export const usePostQuery = (id: number) => {
  return useQuery(createUsePostQueryCacheKey(id), () => fetchPost(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });
};
