import { request } from "../lib/request";
import { CommentService } from "../services/api/CommentService";
import { Post } from "../types/Post";

export const addComment = (postId: number, content: string): Promise<any> =>
  request(`/api/post/${postId}/addComment`, {
    method: "POST",
    data: {
      content,
    },
  }).then((res) => res.data);
