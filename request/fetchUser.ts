import { request } from "../lib/request";
import { User } from "../types/User";

export const fetchUser = (id: number): Promise<User> =>
  request(`/api/user/${id}`).then((res) => res.data);
