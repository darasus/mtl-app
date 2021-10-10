import { useQuery } from "react-query";
import { fetchUserPosts } from "../../request/fetchUserPosts";

export const createUseUserPostsQueryCacheKey = (userId: number) => [
  "userPosts",
  userId,
];

export const useUserPostsQuery = (userId: number) => {
  return useQuery(
    createUseUserPostsQueryCacheKey(userId),
    () => fetchUserPosts(userId),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
    }
  );
};
