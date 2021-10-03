import { request } from "../lib/request";
import { Post } from "../types/Post";

export const fetchUserPosts = (id: number): Promise<Post[]> =>
  request(`/api/user/${id}/posts`).then((res) => res.data);
