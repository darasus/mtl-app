import { request } from "../lib/request";
import { Post } from "../types/Post";

export const fetchFeed = (): Promise<Post[]> =>
  request("/api/feed").then((res) => res.data);
