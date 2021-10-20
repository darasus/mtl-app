import { useQuery } from "react-query";
import { useFetcher } from "../useFetcher";

export const createUseDoIFollowUserQueryQueryCache = (userId: number) => [
  "doIFollowUser",
  userId,
];

export const useDoIFollowUserQuery = (userId: number) => {
  const fetcher = useFetcher();

  return useQuery(
    createUseDoIFollowUserQueryQueryCache(userId),
    () => fetcher.doIFollowUser(userId),
    {
      staleTime: 60 * 60 * 24,
    }
  );
};
