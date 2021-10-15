import { useMutation, useQueryClient } from "react-query";
import { Fetcher } from "../../lib/Fetcher";
import { createUseDoIFollowUserQueryQueryCache } from "../query/useDoIFollowUserQuery";
import { createUseFollowersCountQueryCacheKey } from "../query/useFollowersCountQuery";

export const useFollowMutation = () => {
  const qc = useQueryClient();
  const fetcher = new Fetcher();

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
