import { request } from "../lib/request";
import { Post } from "../types/Post";

export const fetchPost = (id: number): Promise<Post> =>
  request(`/api/post/${id}`).then((res) => res.data);
