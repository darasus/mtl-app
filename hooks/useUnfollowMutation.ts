import { useMutation, useQueryClient } from "react-query";
import { unfollowUser } from "../request/unfollowUser";
import { createUseDoIFollowUserQueryQueryCache } from "./useDoIFollowUserQuery";
import { createUseFollowersCountQueryCacheKey } from "./useFollowersCountQuery";

export const useUnfollowMutation = () => {
  const qc = useQueryClient();

  return useMutation<unknown, unknown, { userId: number }>(
    ({ userId }) => unfollowUser(userId).then((res) => res.data),
    {
      onSuccess(_, { userId }) {
        qc.invalidateQueries(createUseFollowersCountQueryCacheKey(userId));
        qc.invalidateQueries(createUseDoIFollowUserQueryQueryCache(userId));
      },
    }
  );
};
