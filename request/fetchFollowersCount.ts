import axios from "axios";
import { Post } from "../types/Post";

export const fetchFollowersCount = (userId: number): Promise<any> =>
  axios(`/api/user/${userId}/follow/count`).then((res) => res.data);
