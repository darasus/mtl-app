import { useQuery } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";

export const useFollowersCountQuery = (userId: number) => {
  const fetcher = useFetcher();

  return useQuery(
    clientCacheKey.createFollowersCountKey(userId),
    () => fetcher.getFollowersCount(userId),
    {
      staleTime: 60 * 60 * 24,
    }
  );
};
