import { useQuery, useQueryClient } from "react-query";
import { fetchUserPosts } from "../../request/fetchUserPosts";
import { commentsKey } from "./useCommentsQuery";
import { createUsePostQueryCacheKey } from "./usePostQuery";

export const createUseUserPostsQueryCacheKey = (userId: number) => [
  "userPosts",
  userId,
];

export const useUserPostsQuery = (userId: number) => {
  const queryClient = useQueryClient();

  return useQuery(
    createUseUserPostsQueryCacheKey(userId),
    () => fetchUserPosts(userId),
    {
      enabled: !!userId,
      staleTime: 1000 * 60 * 5,
      onSuccess(data) {
        data.forEach((post) => {
          const postCache = queryClient.getQueryData(
            createUsePostQueryCacheKey(post.id)
          );
          const postCommentsCache = queryClient.getQueryData(
            commentsKey.postComments(post.id)
          );

          if (!postCache) {
            queryClient.setQueryData(createUsePostQueryCacheKey(post.id), post);
          }

          if (!postCommentsCache) {
            queryClient.setQueryData(commentsKey.postComments(post.id), {
              items: post.comments,
              count: post.comments.length,
              total: post.commentsCount,
            });
          }
        });
      },
    }
  );
};
