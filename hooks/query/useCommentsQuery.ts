import { useInfiniteQuery } from "react-query";
import { fetchComments } from "../../request/fetchComments";

export const commentsKey = {
  base: ["comments"],
  postComments: (postId: number) => [...commentsKey.base, { postId }],
} as const;

export const useCommentsQuery = ({
  postId,
  enabled,
}: {
  postId: number;
  enabled: boolean;
}) => {
  return useInfiniteQuery(
    commentsKey.postComments(postId),
    ({ pageParam = undefined }) =>
      fetchComments({ postId, take: 5, cursor: pageParam }).then((res) => res),
    {
      getNextPageParam: (lastPage, pages) => {
        const localTotal = pages
          .map((page) => page.count)
          .reduce((prev, next) => prev + next, 0);

        if (localTotal === lastPage.total) return undefined;

        return lastPage.cursor;
      },
      enabled: !!postId && typeof enabled === "boolean" ? enabled : true,
      keepPreviousData: true,
      cacheTime: 1000 * 60 * 60,
    }
  );
};
