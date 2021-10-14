import { useQuery, useQueryClient } from "react-query";
import { fetchPost } from "../../request/fetchPost";
import { commentsKey } from "./useCommentsQuery";

export const createUsePostQueryCacheKey = (id: number) => ["post", id];

export const usePostQuery = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery(createUsePostQueryCacheKey(id), () => fetchPost(id), {
    enabled: !!id,
    staleTime: 1000 * 60 * 60,
    onSuccess(data) {
      const comments = queryClient.getQueryData(commentsKey.postComments(id));

      if (!comments && data && data.comments.length > 0) {
        queryClient.setQueryData(commentsKey.postComments(data.id), {
          items: data.comments,
          count: data.comments.length,
          total: data.commentsCount,
        });
      }
    },
  });
};
