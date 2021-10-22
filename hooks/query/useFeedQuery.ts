import { useInfiniteQuery, useQueryClient } from "react-query";
import { FeedType } from "../../types/FeedType";
import { hours } from "../../utils/duration";
import { useFetcher } from "../useFetcher";
import { commentsKey } from "./useCommentsQuery";
import { createUsePostQueryCacheKey } from "./usePostQuery";

export const createUseFeedQueryCacheKey = ({
  feedType,
}: {
  feedType: FeedType;
}) => ["feed", { feedType }];

export const useFeedQuery = ({ feedType }: { feedType: FeedType }) => {
  const queryClient = useQueryClient();
  const fetcher = useFetcher();

  return useInfiniteQuery(
    createUseFeedQueryCacheKey({ feedType }),
    ({ pageParam = undefined }) =>
      fetcher.getFeed({ feedType, cursor: pageParam }),
    {
      getNextPageParam: (lastPage, pages) => {
        const localTotal = pages
          .map((page) => page.count)
          .reduce((prev, next) => prev + next, 0);

        if (localTotal === lastPage.total) return undefined;

        return lastPage.cursor;
      },
      staleTime: hours(1),
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
              });
            }
          });
        });
      },
    }
  );
};
