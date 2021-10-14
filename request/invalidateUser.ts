import { request } from "../lib/request";

export const invalidateUser = (userId: number): Promise<any> =>
  request(`/api/user/${userId}/invalidate`, {
    method: "POST",
    data: {},
  }).then((res) => res.data);
