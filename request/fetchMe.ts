import axios from "axios";
import { User } from "../types/User";

export const fetchMe = (): Promise<User> =>
  axios(`${process.env.BASE_URL}/api/me`).then((res) => res.data);
