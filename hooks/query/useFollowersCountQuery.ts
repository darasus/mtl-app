import { useQuery } from "react-query";
import { fetchFollowersCount } from "../../request/fetchFollowersCount";

export const createUseFollowersCountQueryCacheKey = (userId: number) => [
  "followersCount",
  userId,
];

export const useFollowersCountQuery = (userId: number) => {
  return useQuery(createUseFollowersCountQueryCacheKey(userId), () =>
    fetchFollowersCount(userId).then((res) => res)
  );
};
