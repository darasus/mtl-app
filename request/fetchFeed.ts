import axios from "axios";
import { Post } from "../types/Post";

export const fetchFeed = (): Promise<Post[]> =>
  axios(`/api/feed`).then((res) => res.data);
