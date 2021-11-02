import { useQuery, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
import { useFetcher } from "../useFetcher";
import { createUsePostQueryCacheKey } from "./usePostQuery";

export const createUseUserPostsQueryCacheKey = (userId: number) => [
  "userPosts",
  userId,
];

export const useUserPostsQuery = (userId: number) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useQuery(
    createUseUserPostsQueryCacheKey(userId),
    () => fetcher.getUserPosts(userId),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
      onSuccess(data) {
        data.forEach((post) => {
          const postCache = queryClient.getQueryData(
            createUsePostQueryCacheKey(post.id)
          );
          const postCommentsCache = queryClient.getQueryData(
            clientCacheKey.createPostCommentsKey(post.id)
          );

          if (!postCache) {
            queryClient.setQueryData(createUsePostQueryCacheKey(post.id), post);
          }

          if (!postCommentsCache) {
            queryClient.setQueryData(
              clientCacheKey.createPostCommentsKey(post.id),
              {
                items: post.comments,
                count: post.comments.length,
                total: post.commentsCount,
              }
            );
          }
        });
      },
    }
  );
};
