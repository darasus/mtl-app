import { useMutation, useQueryClient } from "react-query";
import { followUser } from "../request/followUser";
import { createUseDoIFollowUserQueryQueryCache } from "./useDoIFollowUserQuery";
import { createUseFollowersCountQueryCacheKey } from "./useFollowersCountQuery";

export const useFollowMutation = () => {
  const qc = useQueryClient();

  return useMutation<unknown, unknown, { userId: number }>(
    ({ userId }) => followUser(userId).then((res) => res.data),
    {
      onSuccess(_, { userId }) {
        qc.invalidateQueries(createUseFollowersCountQueryCacheKey(userId));
        qc.invalidateQueries(createUseDoIFollowUserQueryQueryCache(userId));
      },
    }
  );
};
