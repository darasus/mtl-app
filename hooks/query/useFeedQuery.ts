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
      staleTime: 1000 * 60 * 60,
      onSuccess(data) {
        data.pages.forEach((page) => {
          page.items.forEach((post) => {
            const postCache = queryClient.getQueryData(
              createUsePostQueryCacheKey(post.id)
            );
            const postCommentsCache = queryClient.getQueryData(
              commentsKey.postComments(post.id)
            );

            if (!postCache) {
              queryClient.setQueryData(
                createUsePostQueryCacheKey(post.id),
                post
              );
            }

            if (!postCommentsCache) {
              queryClient.setQueryData(commentsKey.postComments(post.id), {
                items: post.comments,
                count: post.comments.length,
                total: post.commentsCount,
                cursor: post.comments[0].id,
              });
            }
          });
        });
      },
    }
  );
};
