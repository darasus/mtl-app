import axios from "axios";
import { Post } from "../types/Post";

export const fetchUserPosts = (id: number): Promise<Post[]> =>
  axios(`/api/user/${id}/posts`).then((res) => res.data);
