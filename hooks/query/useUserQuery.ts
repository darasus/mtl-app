import { useQuery } from "react-query";
import { useFetcher } from "../useFetcher";

export const createUseUserQueryCacheKey = (userId: number) => [
  "user",
  { userId },
];

export const useUserQuery = (userId: number) => {
  const fetcher = useFetcher();

  return useQuery(
    createUseUserQueryCacheKey(userId),
    () => fetcher.getUser(userId),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
};
