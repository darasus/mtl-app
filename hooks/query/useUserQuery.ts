import { useQuery } from "react-query";
import { fetchUser } from "../../request/fetchUser";

export const createUseUserQueryCacheKey = (userId: number) => ["user", userId];

export const useUserQuery = (userId: number) => {
  return useQuery(createUseUserQueryCacheKey(userId), () => fetchUser(userId), {
    staleTime: 1000 * 60 * 5,
  });
};
