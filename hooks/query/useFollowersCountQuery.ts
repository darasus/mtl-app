import { useQuery } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const createUseFollowersCountQueryCacheKey = (userId: number) => [
  "followersCount",
  userId,
];

export const useFollowersCountQuery = (userId: number) => {
  const fetcher = new Fetcher();

  return useQuery(
    createUseFollowersCountQueryCacheKey(userId),
    () => fetcher.getFollowersCount(userId),
    {
      staleTime: 60 * 60 * 24,
    }
  );
};
