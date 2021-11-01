import { useInfiniteQuery } from "react-query";
import { days } from "../../utils/duration";
import { useFetcher } from "../useFetcher";

export const createUseUserActivityQueryCacheKey = (userId: number) => [
  "user-activity",
  { userId },
];

export const useUserActivityQuery = (userId: number) => {
  const fetcher = useFetcher();

  return useInfiniteQuery(
    createUseUserActivityQueryCacheKey(userId),
    ({ pageParam = undefined }) =>
      fetcher.getUserActivity({ userId, cursor: pageParam }),
    {
      staleTime: days(1),
      enabled: !!userId,
      getNextPageParam: (lastPage, pages) => {
        const localTotal = pages
          .map((page) => page.count)
          .reduce((prev, next) => prev + next, 0);

        if (localTotal === lastPage.total) return undefined;

        return lastPage.cursor;
      },
    }
  );
};
