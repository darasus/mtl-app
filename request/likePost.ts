import { request } from "../lib/request";
import { Post } from "../types/Post";

export const likePost = (postId: number): Promise<Post[]> =>
  request(`/api/post/${postId}/like`, {
    method: "POST",
  }).then((res) => res.data);
