import { request } from "../lib/request";

export const unfollowUser = (userId: number): Promise<any> =>
  request(`/api/user/${userId}/unfollow`, {
    method: "POST",
  }).then((res) => res.data);
