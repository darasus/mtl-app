import { useQuery, useQueryClient } from "react-query";
import { fetchPost } from "../../request/fetchPost";
import { createUseCommentsQueryCacheKey } from "./useCommentsQuery";

export const createUsePostQueryCacheKey = (id: number) => ["post", id];

export const usePostQuery = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery(createUsePostQueryCacheKey(id), () => fetchPost(id), {
    enabled: !!id,
    onSuccess(data) {
      if (data) {
        queryClient.setQueryData(createUseCommentsQueryCacheKey(id, 3), {
          items: data.comments,
          count: data.comments.length,
          total: data.commentsCount,
        });
      }
    },
  });
};
