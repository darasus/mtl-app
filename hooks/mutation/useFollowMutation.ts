import { useMutation, useQueryClient } from "react-query";
import { createUseDoIFollowUserQueryQueryCache } from "../query/useDoIFollowUserQuery";
import { createUseFollowersCountQueryCacheKey } from "../query/useFollowersCountQuery";
import { useFetcher } from "../useFetcher";

export const useFollowMutation = () => {
  const qc = useQueryClient();
  const fetcher = useFetcher();

  return useMutation<unknown, unknown, { userId: number }>(
    ({ userId }) => fetcher.followUser(userId),
    {
      onSuccess(_, { userId }) {
        qc.invalidateQueries(createUseFollowersCountQueryCacheKey(userId));
        qc.invalidateQueries(createUseDoIFollowUserQueryQueryCache(userId));
      },
    }
  );
};
