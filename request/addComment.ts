import { request } from "../lib/request";
import { Post } from "../types/Post";

export const addComment = (postId: number, content: string): Promise<Post[]> =>
  request(`/api/post/${postId}/addComment`, {
    method: "POST",
    data: {
      content,
    },
  }).then((res) => res.data);
