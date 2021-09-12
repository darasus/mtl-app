import { useQuery } from "react-query";
import { fetchFollowersCount } from "../request/fetchFollowersCount";
import { followUser } from "../request/followUser";

export const useFollowersCountQuery = (userId: number) => {
  return useQuery(["followersCount", userId], () =>
    fetchFollowersCount(userId).then((res) => res.data)
  );
};
