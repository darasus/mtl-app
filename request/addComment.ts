import axios from "axios";
import { Post } from "../types/Post";

export const addComment = (postId: number, content: string): Promise<Post[]> =>
  axios(`${process.env.BASE_URL}/api/post/${postId}/addComment`, {
    method: "POST",
    data: {
      content,
    },
  }).then((res) => res.data);