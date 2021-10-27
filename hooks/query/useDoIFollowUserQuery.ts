import { useQuery } from "react-query";
import { days } from "../../utils/duration";
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
      staleTime: days(1),
    }
  );
};
