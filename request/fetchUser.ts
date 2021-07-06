import axios from "axios";
import { User } from "../types/User";

export const fetchUser = (id: number): Promise<User> =>
  axios(`${process.env.BASE_URL}/api/user/${id}`).then((res) => res.data);