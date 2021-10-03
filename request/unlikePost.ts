import axios from "axios";
import { Post } from "../types/Post";

export const unlikePost = (postId: number): Promise<void> =>
  axios(`/api/post/${postId}/unlike`, {
    method: "POST",
  }).then((res) => res.data);
