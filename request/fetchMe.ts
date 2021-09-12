import axios from "axios";
import { User } from "../types/User";

export const fetchMe = (): Promise<User> =>
  axios(`/api/me`).then((res) => res.data);
