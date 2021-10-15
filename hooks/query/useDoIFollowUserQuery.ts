import { useQuery } from "react-query";
import { Fetcher } from "../../lib/Fetcher";

export const createUseDoIFollowUserQueryQueryCache = (userId: number) => [
  "doIFollowUser",
  userId,
];

export const useDoIFollowUserQuery = (userId: number) => {
  const fetcher = new Fetcher();

  return useQuery(createUseDoIFollowUserQueryQueryCache(userId), () =>
    fetcher.doIFollowUser(userId)
  );
};
