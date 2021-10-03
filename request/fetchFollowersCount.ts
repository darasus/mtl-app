import { request } from "../lib/request";

export const fetchFollowersCount = (userId: number): Promise<any> =>
  request(`/api/user/${userId}/follow/count`).then((res) => res.data);
