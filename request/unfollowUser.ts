import axios from "axios";

export const unfollowUser = (userId: number): Promise<any> =>
  axios(`/api/user/${userId}/unfollow`, {
    method: "POST",
  }).then((res) => res.data);
