import { useQuery } from "react-query";
import { useFetcher } from "../useFetcher";

export const createUseFollowersCountQueryCacheKey = (userId: number) => [
  "followersCount",
  userId,
];

export const useFollowersCountQuery = (userId: number) => {
  const fetcher = useFetcher();

  return useQuery(
    createUseFollowersCountQueryCacheKey(userId),
    () => fetcher.getFollowersCount(userId),
    {
      staleTime: 60 * 60 * 24,
    }
  );
};
