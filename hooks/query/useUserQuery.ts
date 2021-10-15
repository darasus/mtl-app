import { useQuery } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const createUseUserQueryCacheKey = (userId: number) => [
  "user",
  { userId },
];

export const useUserQuery = (userId: number) => {
  const fetcher = new Fetcher();

  return useQuery(
    createUseUserQueryCacheKey(userId),
    () => fetcher.getUser(userId),
    {
      staleTime: 1000 * 60 * 5,
    }
  );
};
