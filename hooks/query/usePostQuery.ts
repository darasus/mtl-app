import { useQuery, useQueryClient } from "react-query";
import { fetchPost } from "../../request/fetchPost";
import { commentsKey } from "./useCommentsQuery";

export const createUsePostQueryCacheKey = (id: number) => ["post", id];

export const usePostQuery = (id: number) => {
  const queryClient = useQueryClient();

  return useQuery(createUsePostQueryCacheKey(id), () => fetchPost(id), {
    enabled: !!id,
    cacheTime: 1000 * 60 * 60,
    onSuccess(data) {
      if (data && data.comments.length > 0) {
        queryClient.setQueryData(commentsKey.postComments(data.id), {
          pages: [
            {
              items: data.comments,
              count: data.comments.length,
              total: data.commentsCount,
              cursor: data.comments[0].id,
            },
          ],
        });
      }
    },
  });
};
