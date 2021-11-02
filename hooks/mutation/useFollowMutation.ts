import { useMutation, useQueryClient } from "react-query";
import { clientCacheKey } from "../../lib/ClientCacheKey";
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
        qc.invalidateQueries(clientCacheKey.createDoIFollowUserKey(userId));
        qc.invalidateQueries(["feed"]);
      },
    }
  );
};
