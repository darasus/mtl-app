import { useInfiniteQuery, useQueryClient } from "react-query";
import { fetchFeed } from "../../request/fetchFeed";
import { commentsKey } from "./useCommentsQuery";
import { createUsePostQueryCacheKey } from "./usePostQuery";

export const createUseFeedQueryCacheKey = () => ["feed"];

export const useFeedQuery = () => {
  const queryClient = useQueryClient();

  return useInfiniteQuery(
    createUseFeedQueryCacheKey(),
    ({ pageParam = undefined }) => fetchFeed({ cursor: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        const localTotal = pages
          .map((page) => page.count)
          .reduce((prev, next) => prev + next, 0);

        if (localTotal === lastPage.total) return undefined;

        return lastPage.cursor;
      },
      onSuccess(data) {
        data.pages.forEach((page) => {
          page.items.forEach((item) => {
            queryClient.setQueryData(createUsePostQueryCacheKey(item.id), item);
            queryClient.setQueryData(
              commentsKey.postCommentsWithTake(item.id, 3),
              {
                items: item.comments,
                count: item.comments.length,
                total: item.commentsCount,
              }
            );
          });
        });
      },
    }
  );
};
