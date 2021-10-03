import { request } from "../lib/request";

export const doIFollowUser = (userId: number): Promise<any> =>
  request(`/api/user/${userId}/follow`).then((res) => res.data);
