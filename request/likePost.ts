import axios from "axios";
import { Post } from "../types/Post";

export const likePost = (postId: number): Promise<Post[]> =>
  axios(`/api/post/${postId}/like`, {
    method: "POST",
  }).then((res) => res.data);
