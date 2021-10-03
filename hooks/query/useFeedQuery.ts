import { useQuery, useQueryClient } from "react-query";
import { fetchFeed } from "../../request/fetchFeed";
import { createUseCommentsQueryCacheKey } from "./useCommentsQuery";

export const createUseFeedQueryCacheKey = () => "feed";

export const useFeedQuery = () => {
  const queryClient = useQueryClient();

  return useQuery(createUseFeedQueryCacheKey(), fetchFeed, {
    onSuccess(data) {
      data.forEach((item) => {
        queryClient.setQueryData(createUseCommentsQueryCacheKey(item.id, 3), {
          pages: [
            {
              items: item.comments,
              count: item.comments.length,
              total: item.commentsCount,
            },
          ],
        });
      });
    },
  });
};
