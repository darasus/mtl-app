import { request } from "../lib/request";

export const followUser = (userId: number): Promise<any> =>
  request(`/api/user/${userId}/follow`, {
    method: "POST",
  }).then((res) => res.data);
