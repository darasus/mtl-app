import { useQuery } from "react-query";
import { doIFollowUser } from "../request/doIFollowUser";

export const createUseDoIFollowUserQueryQueryCache = (userId: number) => [
  "doIFollowUser",
  userId,
];

export const useDoIFollowUserQuery = (userId: number) => {
  return useQuery<boolean>(createUseDoIFollowUserQueryQueryCache(userId), () =>
    doIFollowUser(userId).then((res) => res.doIFollow)
  );
};
