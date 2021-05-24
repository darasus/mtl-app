import axios from "axios";
import { Post } from "../types/Post";

export const fetchFeed = (): Promise<Post[]> =>
  axios(`${process.env.BASE_URL}/api/feed`).then((res) => res.data);
