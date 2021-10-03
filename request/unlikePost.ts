import { request } from "../lib/request";

export const unlikePost = (postId: number): Promise<void> =>
  request(`/api/post/${postId}/unlike`, {
    method: "POST",
  }).then((res) => res.data);
