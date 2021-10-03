import { request } from "../lib/request";
import { User } from "../types/User";

export const fetchMe = (): Promise<User> =>
  request(`/api/me`).then((res) => res.data);
